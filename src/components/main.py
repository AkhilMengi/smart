"""
FastAPI application - REST endpoints for the agent
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import pandas as pd
from io import BytesIO
from typing import List
import time
import json
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.models import CaseRecord, AgentDecision, BatchAnalysisResult
from app.agent import run_agent_analysis  # Purely agentic ReAct agent
from app.stream_parser import StreamingParser  # Real-time streaming parser
from app.tools import get_master_cn_list, set_master_cn_list, validate_cn  # CN validation


def _format_sse_event(payload: dict, event: str | None = None) -> str:
    """Format a server-sent event payload."""
    lines = []
    if event:
        lines.append(f"event: {event}")
    lines.append(f"data: {json.dumps(payload, default=str)}")
    return "\n".join(lines) + "\n\n"

# ========== RESULTS CACHE (In-Memory Storage) ==========
# Stores the latest analysis results for quick retrieval via GET endpoints
RESULTS_CACHE = {
    "latest_analysis": None,
    "timestamp": None,
    "file_name": None,
    "total_accounts": 0,
}

# Create FastAPI app
app = FastAPI(
    title="Meter Issue Classification Agent",
    description="AI-agentic system for classifying meter issues (D367, D86)",
    version="1.0.0",
    redirect_slashes=True  # Allow trailing slash handling
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server
        "http://localhost:3000",      # Alternative dev server
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "🤖 PURELY AGENTIC Meter Issue Classification Agent",
        "info": "The LLM makes ALL decisions - no rule-based logic",
        "endpoints": {
            "parse": "POST /api/v1/parse-stream - Parse Excel to JSON with real-time progress",
            "analyze": "POST /api/v1/analyze - Analyze single account (AI reasoning)",
            "analyze-stream": "POST /api/v1/analyze-stream - Analyze single account with SSE streaming",
            "batch": "POST /api/v1/batch - Batch analyze from Excel (AI reasoning)",
            "batch-json": "POST /api/v1/batch-json - Batch analyze from JSON array",
            "batch-json-stream": "POST /api/v1/batch-json-stream - Batch analyze from JSON array with SSE streaming",
            "analyze-parsed": "POST /api/v1/analyze-parsed - Analyze all parsed accounts (AI reasoning)",
            "results-by-issue": "GET /api/v1/results/by-issue - Get results grouped by issue type (D367/D86) ⭐ NEW",
            "status": "GET /api/v1/status - Health check",
            "docs": "GET /docs - API documentation"
        },
        "workflow": [
            "1. POST /parse-stream (upload Excel) → streams progress",
            "2. POST /analyze-parsed (run AI analysis) → caches results",
            "3. GET /results/by-issue (retrieve grouped results) ← NEW!"
        ]
    }


@app.get("/api/v1/status")
async def health_check():
    """System health check endpoint"""
    return {
        "status": "healthy",
        "service": "Meter Issue Classification Agent",
        "timestamp": time.time(),
        "ready": True
    }


@app.post("/api/v1/parse-progress")
async def parse_progress_stream(file: UploadFile = File(...)):
    """
    🚀 NEW: Stream real-time parsing progress with Server-Sent Events (SSE)
    
    - Updates progress bar in real-time
    - Shows pipeline stages as they complete
    - Returns parsed data when complete
    
    Use this endpoint with EventSource for live updates!
    
    Frontend usage:
    ```javascript
    const eventSource = new EventSource('http://localhost:8000/api/v1/parse-progress');
    eventSource.onmessage = (event) => {
      const progress = JSON.parse(event.data);
      console.log(`Progress: ${progress.progress}% - ${progress.description}`);
    };
    ```
    """
    try:
        print(f"\n🎬 STREAMING: {file.filename}")
        
        # Create parsed_data folder if not exists
        parsed_dir = "parsed_data"
        if not os.path.exists(parsed_dir):
            os.makedirs(parsed_dir)
        
        # Read file content
        content = await file.read()
        
        # Create streaming parser
        parser = StreamingParser(content, file.filename)
        
        async def stream_events():
            """Yield SSE formatted progress events"""
            try:
                async for progress_json in parser.parse_stream():
                    # Parse to extract data
                    progress = json.loads(progress_json.strip())
                    
                    # If complete stage, save the data
                    if progress['stage'] == 'complete' and 'data' in progress['details']:
                        json_path = os.path.join(parsed_dir, "parsed_data.json")
                        with open(json_path, 'w') as f:
                            json.dump(progress['details']['data'], f, indent=2)
                        
                        print(f"   ✅ Saved: {json_path}")
                        print(f"   Total rows: {progress['details'].get('total_rows', 0)}")
                        print(f"   Total time: {progress['details'].get('total_time', 0):.2f}s")
                    
                    # Yield as SSE
                    yield f"data: {progress_json}"
                    
            except Exception as e:
                print(f"   ❌ Error: {str(e)}")
                yield f"data: {json.dumps({'error': str(e), 'progress': 0})}\n"
        
        # Return streaming response with SSE
        return StreamingResponse(
            stream_events(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
                "Access-Control-Allow-Origin": "*"
            }
        )
        
    except Exception as e:
        print(f"❌ Parse error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Parsing failed: {str(e)}"
        )


@app.post("/api/v1/parse-stream")
async def parse_stream(file: UploadFile = File(...)):
    """
    Parse Excel file and save as JSON to parsed_data folder
    
    Returns: Parsed data with file info
    """
    try:
        print(f"\n📄 Parse Stream: {file.filename}")
        
        # Create parsed_data folder if not exists
        parsed_dir = "parsed_data"
        if not os.path.exists(parsed_dir):
            os.makedirs(parsed_dir)
            print(f"   Created directory: {parsed_dir}")
        
        # Read Excel file
        content = await file.read()
        df = pd.read_excel(BytesIO(content))
        
        print(f"   Loaded {len(df)} rows from Excel")
        
        # Convert to JSON-serializable format
        data_dict = df.to_dict(orient='records')
        
        # Use fixed filename (overwrites previous parse)
        json_filename = "parsed_data.json"
        json_path = os.path.join(parsed_dir, json_filename)
        
        # Save to JSON file
        with open(json_path, 'w') as f:
            json.dump(data_dict, f, indent=2)
        
        print(f"   ✅ Saved to: {json_path}")
        
        return {
            "status": "success",
            "message": f"File parsed and saved",
            "filename": file.filename,
            "saved_as": json_filename,
            "saved_path": json_path,
            "total_rows": len(df),
            "columns": list(df.columns),
            "data": data_dict,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"❌ Parse error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Parsing failed: {str(e)}"
        )


@app.post("/api/v1/analyze", response_model=AgentDecision)
async def analyze_single_account(case: CaseRecord):
    """
    Analyze a single case — the agent reads all active issue flags,
    consults the mandatory SOPs, and returns recommended actions.
    """
    try:
        print(f"\nAPI Request: /analyze for case {case.CN}")
        decision = await run_agent_analysis(case)
        print(f"Analysis complete: {len(decision.issues_found)} issues found")
        return decision
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/v1/analyze-stream")
async def analyze_single_account_stream(case: CaseRecord):
    """
    Analyze a single case and stream progress + result as SSE.
    """
    async def stream_events():
        start_time = time.time()
        yield _format_sse_event(
            {
                "stage": "start",
                "mode": "single",
                "CN": case.CN,
                "log": f"[{case.CN}] Received request. Starting validation...",
                "timestamp": datetime.utcnow().isoformat(),
            },
            event="progress",
        )

        try:
            is_valid, validation_reason = validate_cn(case.CN)
            if not is_valid:
                yield _format_sse_event(
                    {
                        "stage": "validation-failed",
                        "mode": "single",
                        "CN": case.CN,
                        "log": f"[{case.CN}] Validation failed: {validation_reason}",
                        "detail": validation_reason,
                    },
                    event="error",
                )
                return

            yield _format_sse_event(
                {
                    "stage": "validated",
                    "mode": "single",
                    "CN": case.CN,
                    "log": f"[{case.CN}] Validation completed. Calling LLM...",
                },
                event="progress",
            )

            decision = await run_agent_analysis(case)
            elapsed_ms = (time.time() - start_time) * 1000
            yield _format_sse_event(
                {
                    "stage": "complete",
                    "mode": "single",
                    "CN": case.CN,
                    "processing_time_ms": round(elapsed_ms, 2),
                    "log": f"[{case.CN}] Analysis completed successfully.",
                    "result": decision.model_dump(mode="json"),
                },
                event="complete",
            )
        except Exception as e:
            yield _format_sse_event(
                {
                    "stage": "error",
                    "mode": "single",
                    "CN": case.CN,
                    "log": f"[{case.CN}] Analysis failed: {str(e)}",
                    "detail": f"Analysis failed: {str(e)}",
                },
                event="error",
            )

    return StreamingResponse(
        stream_events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.post("/api/v1/batch", response_model=BatchAnalysisResult)
async def batch_analyze(file: UploadFile = File(...)):
    """
    Batch analyze multiple accounts from Excel file
    
    Expected columns: account_id, meter_config, payg, two_rate_meter, 
                     account_setup, OMR, polling
    
    Returns: Results for all accounts with reasoning
    """
    try:
        print(f"\n📁 Batch Upload: {file.filename}")
        
        # Read Excel file
        content = await file.read()
        df = pd.read_excel(BytesIO(content))
        
        print(f"   Loaded {len(df)} accounts")
        
        # Validate columns
        required_columns = [
            'account_id', 'meter_config', 'payg', 'two_rate_meter',
            'account_setup', 'OMR', 'polling'
        ]
        
        missing_cols = [col for col in required_columns if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing columns: {missing_cols}")
        
        # Parse accounts
        accounts = []
        for idx, row in df.iterrows():
            account = MeterAccount(
                account_id=str(row['account_id']),
                meter_config=int(row['meter_config']),
                payg=str(row['payg']).lower(),
                two_rate_meter=str(row['two_rate_meter']).lower(),
                account_setup=int(row['account_setup']),
                OMR=int(row['OMR']),
                polling=int(row['polling'])
            )
            accounts.append(account)
        
        print(f"   Parsed {len(accounts)} accounts")
        
        # Analyze each account
        batch_start = time.time()
        results = []
        
        for i, account in enumerate(accounts):
            print(f"\n   [{i+1}/{len(accounts)}] Processing {account.account_id}")
            decision = await run_agent_analysis(account)
            results.append(decision)
        
        batch_time = (time.time() - batch_start) * 1000
        
        # Create batch result
        batch_result = BatchAnalysisResult(
            total_accounts=len(accounts),
            processed_accounts=len(results),
            results=results
        )
        
        print(f"\n✅ Batch processing complete")
        print(f"   Total accounts: {len(accounts)}")
        print(f"   Total time: {batch_time:.0f}ms")
        print(f"   Avg time per account: {batch_time/len(accounts):.0f}ms")
        
        return batch_result
        
    except Exception as e:
        print(f"❌ Batch error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Batch processing failed: {str(e)}"
        )


@app.post("/api/v1/batch-json", response_model=BatchAnalysisResult)
async def batch_analyze_json(cases: List[CaseRecord]):
    """
    Batch analyze cases provided as a JSON array.
    """
    try:
        print(f"\nJSON Batch Request: {len(cases)} cases")
        batch_start = time.time()
        results = []
        for i, case in enumerate(cases):
            print(f"   [{i+1}/{len(cases)}] Processing {case.CN}")
            decision = await run_agent_analysis(case)
            results.append(decision)
        batch_time = (time.time() - batch_start) * 1000
        print(f"\nBatch complete — {len(cases)} cases in {batch_time:.0f}ms")
        return BatchAnalysisResult(
            total_accounts=len(cases),
            processed_accounts=len(results),
            results=results,
        )
    except Exception as e:
        print(f"Batch error: {e}")
        raise HTTPException(status_code=400, detail=f"Batch processing failed: {str(e)}")


@app.post("/api/v1/batch-json-stream")
async def batch_analyze_json_stream(cases: List[CaseRecord]):
    """
    Batch analyze JSON cases and stream per-case progress + results as SSE.
    """
    async def stream_events():
        batch_start = time.time()
        total = len(cases)
        processed = 0
        successful_results = []

        yield _format_sse_event(
            {
                "stage": "start",
                "mode": "batch-json",
                "total_accounts": total,
                "log": f"Batch received. Total accounts: {total}. Starting processing...",
                "timestamp": datetime.utcnow().isoformat(),
            },
            event="progress",
        )

        for index, case in enumerate(cases, start=1):
            yield _format_sse_event(
                {
                    "stage": "processing",
                    "mode": "batch-json",
                    "current": index,
                    "total": total,
                    "CN": case.CN,
                    "log": f"[{case.CN}] ({index}/{total}) Starting validation...",
                },
                event="progress",
            )

            try:
                is_valid, validation_reason = validate_cn(case.CN)
                if not is_valid:
                    yield _format_sse_event(
                        {
                            "stage": "validation-failed",
                            "mode": "batch-json",
                            "current": index,
                            "total": total,
                            "CN": case.CN,
                            "log": f"[{case.CN}] Validation failed: {validation_reason}",
                            "detail": validation_reason,
                        },
                        event="error",
                    )
                    return

                yield _format_sse_event(
                    {
                        "stage": "validated",
                        "mode": "batch-json",
                        "current": index,
                        "total": total,
                        "CN": case.CN,
                        "log": f"[{case.CN}] Validation completed. Calling LLM...",
                    },
                    event="progress",
                )

                decision = await run_agent_analysis(case)
                successful_results.append(decision)
                processed += 1

                yield _format_sse_event(
                    {
                        "stage": "case-complete",
                        "mode": "batch-json",
                        "current": index,
                        "total": total,
                        "processed_accounts": processed,
                        "CN": case.CN,
                        "log": f"[{case.CN}] Analysis completed ({processed}/{total}).",
                        "result": decision.model_dump(mode="json"),
                    },
                    event="case-complete",
                )
            except Exception as e:
                yield _format_sse_event(
                    {
                        "stage": "error",
                        "mode": "batch-json",
                        "current": index,
                        "total": total,
                        "CN": case.CN,
                        "log": f"[{case.CN}] Analysis failed: {str(e)}",
                        "detail": f"Batch processing failed: {str(e)}",
                    },
                    event="error",
                )
                return

        total_time_ms = (time.time() - batch_start) * 1000
        yield _format_sse_event(
            {
                "stage": "complete",
                "mode": "batch-json",
                "total_accounts": total,
                "processed_accounts": processed,
                "total_time_ms": round(total_time_ms, 2),
                "log": f"Batch completed. Processed {processed}/{total} accounts.",
                "results": [result.model_dump(mode="json") for result in successful_results],
            },
            event="complete",
        )

    return StreamingResponse(
        stream_events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.post("/api/v1/analyze-parsed", response_model=BatchAnalysisResult)
async def analyze_parsed_data():
    """
    🤖 PURELY AGENTIC - Analyze all accounts from parsed_data.json
    
    The AI (GPT-4) will analyze each account with pure reasoning:
    - No rules, no automation
    - Pure LLM decision-making
    - Full reasoning chains
    
    Just click this endpoint after parsing an Excel file!
    
    Returns: Results for all accounts with AI reasoning
    """
    try:
        parsed_file = "parsed_data/parsed_data.json"
        
        # Check if file exists
        if not os.path.exists(parsed_file):
            raise HTTPException(
                status_code=404,
                detail=f"Parsed data file not found. Please upload and parse an Excel file first."
            )
        
        print(f"\n📊 AGENTIC Analysis of parsed data: {parsed_file}")
        
        # Read parsed JSON file
        with open(parsed_file, 'r') as f:
            data_list = json.load(f)
        
        print(f"   Loaded {len(data_list)} cases for AI analysis")

        # Convert to CaseRecord objects using Pydantic alias population
        cases = []
        for row in data_list:
            try:
                case = CaseRecord.model_validate(row)
                cases.append(case)
            except Exception as e:
                print(f"   Warning: skipping row — {e}")
                continue

        if not cases:
            raise HTTPException(
                status_code=400,
                detail="No valid cases found in parsed data. Check that CN column is present."
            )

        print(f"   Converted {len(cases)} valid cases for AI analysis")

        batch_start = time.time()
        results = []

        for i, case in enumerate(cases):
            print(f"   [{i+1}/{len(cases)}] Analysing {case.CN}...")
            decision = await run_agent_analysis(case)
            results.append(decision)
        
        batch_time = (time.time() - batch_start) * 1000
        
        batch_result = BatchAnalysisResult(
            total_accounts=len(cases),
            processed_accounts=len(results),
            results=results,
        )

        RESULTS_CACHE["latest_analysis"] = results
        RESULTS_CACHE["timestamp"] = datetime.now().isoformat()
        RESULTS_CACHE["file_name"] = "parsed_data.json"
        RESULTS_CACHE["total_accounts"] = len(cases)

        batch_time = (time.time() - batch_start) * 1000
        print(f"\nAnalysis complete — {len(cases)} cases in {batch_time:.0f}ms")
        return batch_result

    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=400, detail=f"Parsed data analysis failed: {str(e)}")


@app.get("/api/v1/examples")
async def get_examples():
    """Get an example request body for the /analyze endpoint"""
    return {
        "single_case_example": {
            "CN": 1001,
            "case_type": "Smart Meter",
            "case_category": "Commissioning",
            "case_sub_category": "SMETS2",
            "case_status": "Open",
            "Smart Meter Not Commissioned": 1,
            "TOU Tariff Not Applied On ENSEK": 0,
            "TOU Tariff With Single Rate Meter": 0,
            "Missing Opening Read": 1,
            "Missing D0367 On Tariff Start Date": 0,
            "Missing D0149 On Tariff Start Date": 0,
            "TPR Mismatch Between D0367 and ENSEK": 0,
            "ESME Not Updated For Elec Meter In ENSEK": 1,
            "Multiple ESME Updated In ENSEK": 0,
            "GSME Not Updated For Gas Meter In ENSEK": 0,
            "Multiple GSME Updated In ENSEK": 0,
            "GPF Not Updated In ENSEK": 0,
            "Multiple GPF Updated On ENSEK": 0,
            "CHF Not Updated In ENSEK": 0,
            "Multiple CHF Updated On ENSEK": 0,
            "count_of_issues": 3,
            "Issues Identified": "Smart Meter Not Commissioned; Missing Opening Read; ESME Not Updated",
        }
    }


@app.get("/api/v1/results/by-issue")
async def get_results_by_issue():
    """
    Returns cached analysis results grouped by issue type.
    Each issue type lists the cases where it was found, with recommended actions.
    Run POST /api/v1/analyze-parsed first to populate the cache.
    """
    try:
        if not RESULTS_CACHE.get("latest_analysis"):
            raise HTTPException(
                status_code=404,
                detail="No analysis results found. Please run analysis first via POST /api/v1/analyze-parsed"
            )
        
        results = RESULTS_CACHE["latest_analysis"]
        total = len(results)

        # Collect every unique issue name across all results
        all_issue_names = sorted({issue for d in results for issue in d.issues_found})

        # Build per-issue breakdown
        by_issue: dict = {}
        for issue_name in all_issue_names:
            matched = [d for d in results if issue_name in d.issues_found]
            by_issue[issue_name] = {
                "count": len(matched),
                "percentage": round((len(matched) / total * 100) if total > 0 else 0, 2),
                "cases": [
                    {
                        "CN": d.CN,
                        "case_type": d.case_type,
                        "case_status": d.case_status,
                        "overall_confidence": d.overall_confidence,
                        "recommended_actions": [
                            action for action in d.recommended_actions
                            if action.startswith(f"[{issue_name}]")
                        ],
                        "sops_consulted": d.sops_consulted,
                        "account_level_action": d.account_level_action,
                        "resolution_dependencies": d.resolution_dependencies,
                        "priority_sequence": d.priority_sequence,
                        "processing_time_ms": d.processing_time_ms,
                    }
                    for d in matched
                ],
            }

        no_issues = [d for d in results if not d.issues_found]

        response = {
            "by_issue": by_issue,
            "no_issues": {
                "count": len(no_issues),
                "percentage": round((len(no_issues) / total * 100) if total > 0 else 0, 2),
                "cases": [
                    {
                        "CN": d.CN,
                        "case_type": d.case_type,
                        "case_status": d.case_status,
                        "overall_confidence": d.overall_confidence,
                        "recommended_actions": [],
                        "sops_consulted": [],
                        "account_level_action": d.account_level_action,
                        "resolution_dependencies": [],
                        "priority_sequence": [],
                        "processing_time_ms": d.processing_time_ms,
                    }
                    for d in no_issues
                ],
            },
            "summary": {
                "total_cases": total,
                "cases_with_issues": total - len(no_issues),
                "cases_without_issues": len(no_issues),
                "unique_issue_types": len(all_issue_names),
                "issue_type_names": all_issue_names,
                "timestamp": RESULTS_CACHE.get("timestamp"),
                "file_source": RESULTS_CACHE.get("file_name"),
                "cached": True,
            },
        }

        print(f"\nResults by issue: {len(all_issue_names)} unique issue types across {total} cases")
        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving results: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve results: {str(e)}")


# ========== MASTER CN LIST VALIDATION ==========

@app.post("/api/v1/load-master-cn-list-from-path")
async def load_master_cn_list_from_path(request: dict):
    """
    Load master CN list from a file path on disk (Excel or CSV).
    The file should have a column named 'CN' or 'Case Number'.
    
    Request body:
    {
        "file_path": "C:\\path\\to\\master_cn_list.xlsx"
    }
    
    This list is used to validate CNs before running analysis.
    Only CNs in this list will be analyzed; others will return validation_failed status.
    """
    try:
        file_path = request.get("file_path")
        
        if not file_path:
            raise HTTPException(status_code=400, detail="file_path is required in request body")
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
        
        # Read file based on extension
        if file_path.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path)
        elif file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            raise HTTPException(status_code=400, detail="File must be Excel (.xlsx, .xls) or CSV (.csv)")
        
        # Find CN column (case-insensitive)
        cn_columns = [col for col in df.columns if col.lower() in ['cn', 'case number', 'case_number']]
        if not cn_columns:
            raise HTTPException(status_code=400, detail=f"File must contain 'CN' or 'Case Number' column. Found columns: {list(df.columns)}")
        
        cn_column = cn_columns[0]
        valid_cns = df[cn_column].dropna().astype(int).unique().tolist()
        
        # Update master list
        success = set_master_cn_list(valid_cns)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save master CN list")
        
        return {
            "status": "success",
            "message": f"Master CN list updated with {len(valid_cns)} valid CNs",
            "valid_cns_count": len(valid_cns),
            "sample_cns": sorted(valid_cns)[:10],
            "file_path": file_path,
            "cn_column_used": cn_column,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error loading master CN list: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load master CN list: {str(e)}")


@app.post("/api/v1/upload-master-cn-list")
async def upload_master_cn_list(file: UploadFile = File(...)):
    """
    Upload a new master CN list (Excel or CSV).
    The file should have a column named 'CN' or 'Case Number'.
    
    This list is used to validate CNs before running analysis.
    Only CNs in this list will be analyzed; others will return validation_failed status.
    """
    try:
        contents = await file.read()
        
        # Read file based on extension
        if file.filename.endswith('.xlsx') or file.filename.endswith('.xls'):
            df = pd.read_excel(BytesIO(contents))
        elif file.filename.endswith('.csv'):
            df = pd.read_csv(BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="File must be Excel (.xlsx, .xls) or CSV (.csv)")
        
        # Find CN column (case-insensitive)
        cn_columns = [col for col in df.columns if col.lower() in ['cn', 'case number', 'case_number']]
        if not cn_columns:
            raise HTTPException(status_code=400, detail="File must contain 'CN' or 'Case Number' column")
        
        cn_column = cn_columns[0]
        valid_cns = df[cn_column].dropna().astype(int).unique().tolist()
        
        # Update master list
        success = set_master_cn_list(valid_cns)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save master CN list")
        
        return {
            "status": "success",
            "message": f"Master CN list updated with {len(valid_cns)} valid CNs",
            "valid_cns_count": len(valid_cns),
            "sample_cns": sorted(valid_cns)[:10],
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading master CN list: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload master CN list: {str(e)}")


@app.get("/api/v1/master-cn-list")
async def get_current_master_cn_list():
    """Retrieve the current master CN list"""
    try:
        valid_cns = get_master_cn_list()
        return {
            "status": "success",
            "total_valid_cns": len(valid_cns),
            "valid_cns": sorted(valid_cns),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Error retrieving master CN list: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve master CN list: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

