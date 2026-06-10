
import { useEffect, useRef, useState } from "react";

const STREAM_URL =
  "http://localhost:8000/api/v1/analyze-stream";

const DEFAULT_PAYLOAD = {
  CN: 456,
  case_type: "Metering",
  case_category: "Fault",
};

export default function AgentStreamUI() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("standby");

  const [validationStatus, setValidationStatus] =
    useState("IDLE");

  const [decisionStatus, setDecisionStatus] =
    useState("IDLE");

  const [validationOutput, setValidationOutput] =
    useState(null);

  const [decisionOutput, setDecisionOutput] =
    useState(null);

  const logRef = useRef(null);
  const controllerRef = useRef(null);

  const addLog = (type, message) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        type,
        message,
      },
    ]);
  };

  useEffect(() => {
    connect();

    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    logRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [logs]);

  const connect = async () => {
    try {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      setLogs([]);
      setStatus("connecting");

      setValidationStatus("RUNNING");
      setDecisionStatus("IDLE");

      const controller = new AbortController();

      controllerRef.current = controller;

      addLog(
        "system",
        `Connected to ${STREAM_URL}`
      );

      const response = await fetch(STREAM_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify(DEFAULT_PAYLOAD),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed with ${response.status}`
        );
      }

      setStatus("connected");

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop();

        for (let line of lines) {
          line = line.trim();

          if (!line) continue;

          if (line.startsWith("data:")) {
            line = line.replace("data:", "");
          }

          try {
            const json = JSON.parse(line);

            addLog(
              json.stage || "event",
              JSON.stringify(json, null, 2)
            );

            if (
              json.stage === "validated"
            ) {
              setValidationStatus(
                "COMPLETE"
              );

              setDecisionStatus(
                "RUNNING"
              );

              setValidationOutput(
                json.result || json
              );
            }

            if (
              json.stage === "complete"
            ) {
              setDecisionStatus(
                "COMPLETE"
              );

              setDecisionOutput(
                json.result || json
              );

              setStatus("complete");
            }
          } catch {
            addLog("log", line);

            if (
              line
                .toLowerCase()
                .includes("closed")
            ) {
              setStatus("closed");
            }
          }
        }
      }
    } catch (err) {
      console.error(err);

      addLog("error", err.message);

      setStatus("error");
    }
  };

  const statusStyle = (value) => {
    switch (value) {
      case "RUNNING":
        return "text-amber-400";

      case "COMPLETE":
        return "text-green-400";

      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* TOP NAV */}
      <div className="h-16 bg-[#151927] border-b border-[#2a3147] flex items-center justify-between px-6">
        <div>
          <p className="text-[10px] tracking-[4px] uppercase text-orange-300">
            Multi-Agent Orchestration
          </p>

          <h1 className="text-white text-xl font-semibold mt-1">
            Agent Orchestra
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-300">
            Stream Status
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                status === "connected"
                  ? "bg-green-500"
                  : status === "connecting"
                  ? "bg-yellow-500"
                  : status === "complete"
                  ? "bg-cyan-500"
                  : "bg-slate-500"
              }`}
            />

            <span className="text-sm text-white capitalize">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6">
        {/* DESCRIPTION */}
        <div className="mb-8">
          <p className="text-slate-500 max-w-4xl">
            Validation agent verifies the incoming case payload.
            Decision agent generates the final classification and routing outcome.
          </p>
        </div>

        {/* AGENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* VALIDATION */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  VA
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-800">
                  Validation Agent
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Validates incoming payload and schema.
                </p>
              </div>

              <div
                className={`text-xs font-semibold tracking-[2px] ${statusStyle(
                  validationStatus
                )}`}
              >
                {validationStatus}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 h-[180px] overflow-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                {validationOutput
                  ? JSON.stringify(
                      validationOutput,
                      null,
                      2
                    )
                  : "Awaiting validation output..."}
              </pre>
            </div>
          </div>

          {/* DECISION */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                  DA
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-800">
                  Decision Agent
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Produces final routing and decision output.
                </p>
              </div>

              <div
                className={`text-xs font-semibold tracking-[2px] ${statusStyle(
                  decisionStatus
                )}`}
              >
                {decisionStatus}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 h-[180px] overflow-auto">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap">
                {decisionOutput
                  ? JSON.stringify(
                      decisionOutput,
                      null,
                      2
                    )
                  : "Awaiting decision output..."}
              </pre>
            </div>
          </div>
        </div>

        {/* MESSAGE BUS */}
        <div className="bg-[#060b17] rounded-3xl overflow-hidden border border-[#1c2233] shadow-2xl">
          {/* TOP */}
          <div className="h-14 border-b border-[#1c2233] px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />

              <h2 className="text-white font-semibold text-lg">
                Agent Message Bus
              </h2>
            </div>

            <button
              onClick={connect}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm text-white"
            >
              Reconnect
            </button>
          </div>

          {/* LOGS */}
          <div className="h-[500px] overflow-auto p-5 bg-gradient-to-b from-[#050816] to-[#02040d] font-mono">
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border border-slate-800 rounded-2xl overflow-hidden bg-white/[0.03]"
                >
                  <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">
                        {log.time}
                      </span>

                      <span className="text-xs uppercase tracking-[2px] text-cyan-400">
                        {log.type}
                      </span>
                    </div>
                  </div>

                  <pre className="p-4 text-sm text-green-400 whitespace-pre-wrap break-words overflow-auto leading-7">
                    {log.message}
                  </pre>
                </div>
              ))}

              <div ref={logRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

