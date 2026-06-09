import { useEffect, useRef, useState } from "react";

const STREAM_URL = "http://localhost:8000/api/v1/analyze-stream";

function nowWithMs() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
}

function stageTone(stage) {
  switch (stage) {
    case "start":
      return "text-blue-600";
    case "validated":
    case "progress":
      return "text-amber-600";
    case "complete":
      return "text-emerald-600";
    case "error":
      return "text-rose-600";
    case "system":
      return "text-sky-600";
    default:
      return "text-slate-600";
  }
}

function logBgColor(stage) {
  switch (stage) {
    case "start":
      return "bg-blue-50 border-blue-200";
    case "validated":
    case "progress":
      return "bg-amber-50 border-amber-200";
    case "complete":
      return "bg-emerald-50 border-emerald-200";
    case "error":
      return "bg-rose-50 border-rose-200";
    case "system":
      return "bg-sky-50 border-sky-200";
    default:
      return "bg-slate-50 border-slate-200";
  }
}

export default function StreamLogs() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("IDLE");
  const [eventCount, setEventCount] = useState(0);
  const [validationOutput, setValidationOutput] = useState(null);
  const [decisionOutput, setDecisionOutput] = useState(null);

  const controllerRef = useRef(null);
  const pendingClockRef = useRef(null);
  const logEndRef = useRef(null);

  const addLog = (type, message, clockValue) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: clockValue || nowWithMs(),
        type,
        message,
      },
    ]);
    setEventCount((c) => c + 1);
  };

  const connect = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    setLogs([]);
    setEventCount(0);
    setStatus("CONNECTING");
    setValidationOutput(null);
    setDecisionOutput(null);
    pendingClockRef.current = null;

    try {
      const controller = new AbortController();
      controllerRef.current = controller;

      const response = await fetch(STREAM_URL, {
        method: "GET",
        headers: {
          Accept: "text/event-stream, application/json",
        },
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed: ${response.status}`);
      }

      setStatus("CONNECTED");
      addLog("system", "Connected to stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";

        for (let line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "**") continue;

          if (/^\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?$/.test(trimmed)) {
            pendingClockRef.current = trimmed;
            continue;
          }

          let content = trimmed;
          if (content.startsWith("data:")) {
            content = content.replace("data:", "").trim();
          }

          const entryClock = pendingClockRef.current || nowWithMs();

          try {
            const json = JSON.parse(content);
            const stage = String(json.stage || "event").toLowerCase();
            addLog(stage, JSON.stringify(json, null, 2), entryClock);

            // Capture validation and decision outputs
            if (stage === "validated") {
              setValidationOutput(json.result || json);
            } else if (stage === "complete") {
              setDecisionOutput(json.result || json);
              setStatus("COMPLETE");
            } else if (stage === "error") {
              setStatus("ERROR");
            }
          } catch {
            addLog("log", content, entryClock);
            if (content.toLowerCase().includes("connection closed")) {
              setStatus((prev) => (prev === "COMPLETE" ? prev : "CLOSED"));
            }
          }

          pendingClockRef.current = null;
        }
      }

      addLog("system", "Stream closed");
      setStatus((prev) => (prev === "COMPLETE" ? prev : "CLOSED"));
    } catch (err) {
      if (err.name === "AbortError") return;

      addLog("error", err.message || "Stream error");
      setStatus("ERROR");
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const statusColor = {
    IDLE: "bg-slate-100 text-slate-700 border-slate-300",
    CONNECTING: "bg-amber-100 text-amber-700 border-amber-300",
    CONNECTED: "bg-emerald-100 text-emerald-700 border-emerald-300",
    COMPLETE: "bg-blue-100 text-blue-700 border-blue-300",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-300",
    ERROR: "bg-rose-100 text-rose-700 border-rose-300",
  };

  return (
    <div className="min-h-full bg-white">
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Stream Logs</h1>
              <p className="mt-2 text-sm text-slate-600">
                Real-time agent analysis logs and events
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  statusColor[status] || statusColor.IDLE
                }`}
              >
                {status}
              </span>

              <button
                onClick={connect}
                className="rounded-full border-2 border-slate-900 bg-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg active:shadow-sm"
              >
                Run Stream
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-4 flex-wrap">
            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Events
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{eventCount}</p>
            </div>

            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Logs Collected
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{logs.length}</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Live Transcript</h2>

            <div className="max-h-[70vh] space-y-3 overflow-y-auto rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
              {logs.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-center">
                  <p className="text-sm text-slate-500">
                    Click "Run Stream" to start collecting logs...
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`overflow-hidden rounded-lg border-2 ${logBgColor(log.type)}`}
                  >
                    <div className="flex items-center justify-between border-b-2 border-current border-opacity-20 px-4 py-2 text-xs">
                      <span className="font-mono text-slate-600">{log.time}</span>
                      <span
                        className={`font-bold uppercase ${stageTone(log.type)}`}
                      >
                        {log.type}
                      </span>
                    </div>

                    <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-xs leading-relaxed text-slate-700">
                      {log.message}
                    </pre>
                  </div>
                ))
              )}

              <div ref={logEndRef} />
            </div>
          </div>
        </section>

        {(validationOutput || decisionOutput) && (
          <section className="mt-6">
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-slate-900">Agent Decisions</h2>

              <div className="grid gap-6 md:grid-cols-2">
                {validationOutput && (
                  <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                      <h3 className="font-bold text-blue-900">Validation Agent</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {typeof validationOutput === "object" &&
                      validationOutput !== null ? (
                        Object.entries(validationOutput).map(([key, val]) => (
                          <div
                            key={key}
                            className="flex justify-between rounded-lg bg-white px-3 py-2"
                          >
                            <span className="font-semibold text-slate-600">{key}:</span>
                            <span className="text-slate-900">
                              {typeof val === "object"
                                ? JSON.stringify(val)
                                : String(val)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <pre className="overflow-x-auto rounded bg-white p-2 font-mono text-xs text-slate-700">
                          {JSON.stringify(validationOutput, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                {decisionOutput && (
                  <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-600" />
                      <h3 className="font-bold text-emerald-900">Decision Agent</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      {typeof decisionOutput === "object" &&
                      decisionOutput !== null ? (
                        Object.entries(decisionOutput).map(([key, val]) => (
                          <div
                            key={key}
                            className="flex justify-between rounded-lg bg-white px-3 py-2"
                          >
                            <span className="font-semibold text-slate-600">{key}:</span>
                            <span className="text-slate-900">
                              {typeof val === "object"
                                ? JSON.stringify(val)
                                : String(val)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <pre className="overflow-x-auto rounded bg-white p-2 font-mono text-xs text-slate-700">
                          {JSON.stringify(decisionOutput, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
