import { useState } from "react";

import {
  FiCheckCircle,
  FiLoader,
  FiUploadCloud,
  FiUsers,
  FiActivity,
  FiDatabase,
  FiClock,
  FiFileText,
  FiCloud,
  FiLayers,
} from "react-icons/fi";

export default function DataIngestion({
  isDark,
}) {
  const [progress, setProgress] =
    useState(0);

  const [status, setStatus] = useState(
    "Waiting for upload..."
  );

  const startPipeline = () => {
    let value = 0;

    const timer = setInterval(() => {
      value += 10;

      setProgress(value);

      if (value < 20)
        setStatus("Reading files...");
      else if (value < 40)
        setStatus("Validating...");
      else if (value < 60)
        setStatus("Transforming...");
      else if (value < 90)
        setStatus("Loading warehouse...");
      else setStatus("Finalizing...");

      if (value >= 100) {
        clearInterval(timer);

        setStatus(
          "Pipeline completed successfully"
        );
      }
    }, 400);
  };

  return (
    <div className="space-y-2.5">
      {/* HERO */}
      <div
        className={`relative overflow-hidden rounded-xl border px-4 py-3 ${
          isDark
            ? "bg-[#0B1120] border-white/5"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Nexus Ingestion
            </h1>

            <p
              className={`mt-1 text-[11px] ${
                isDark
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              Enterprise ingestion and
              validation pipeline
            </p>
          </div>

          <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
            ● Operational
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-2">
        {[
          {
            label: "Customers",
            value: "2.34M",
            sub: "Portfolio",
            icon: <FiUsers />,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Smart Meters",
            value: "91%",
            sub: "Coverage",
            icon: <FiActivity />,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
          },
          {
            label: "Completeness",
            value: "96%",
            sub: "Validated",
            icon: <FiCheckCircle />,
            color:
              "text-emerald-400",
            bg:
              "bg-emerald-500/10",
          },
          {
            label: "Coverage",
            value: "24M",
            sub: "Months",
            icon: <FiDatabase />,
            color: "text-violet-400",
            bg:
              "bg-violet-500/10",
          },
          {
            label: "Last Load",
            value: "14 May",
            sub: "2h ago",
            icon: <FiClock />,
            color:
              "text-orange-400",
            bg:
              "bg-orange-500/10",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`rounded-xl border px-3 py-2.5 transition-all ${
              isDark
                ? "bg-[#0B1120] border-white/5 hover:border-white/10"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>

                <h3 className="mt-2 text-lg font-bold">
                  {card.value}
                </h3>
              </div>

              <div
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs ${card.bg} ${card.color}`}
              >
                {card.icon}
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-500">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-2.5">
        {/* LEFT SIDE */}
        <div className="space-y-2.5">
          {/* DATA SOURCES */}
          <div
            className={`rounded-xl border p-3.5 ${
              isDark
                ? "bg-[#0B1120] border-white/5"
                : "bg-white border-slate-200"
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Data Sources
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  Enterprise datasets
                </p>
              </div>

              <button
                onClick={startPipeline}
                className="px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[11px] font-medium"
              >
                <span className="flex items-center gap-1.5">
                  <FiUploadCloud />
                  Upload
                </span>
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-1.5">
              {[
                {
                  title:
                    "HH Consumption Data",
                  records:
                    "119.4M Records",
                  icon: (
                    <FiActivity />
                  ),
                  color:
                    "text-cyan-400",
                  bg:
                    "bg-cyan-500/10",
                },
                {
                  title:
                    "Customer Master",
                  records:
                    "2.3M Records",
                  icon: <FiUsers />,
                  color:
                    "text-indigo-400",
                  bg:
                    "bg-indigo-500/10",
                },
                {
                  title: "Tariff Data",
                  records:
                    "145 Records",
                  icon: (
                    <FiFileText />
                  ),
                  color:
                    "text-violet-400",
                  bg:
                    "bg-violet-500/10",
                },
                {
                  title:
                    "Wholesale Curves",
                  records:
                    "Scenario Base",
                  icon: (
                    <FiCloud />
                  ),
                  color:
                    "text-orange-400",
                  bg:
                    "bg-orange-500/10",
                },
                {
                  title:
                    "Weather Data",
                  records:
                    "Historical Dataset",
                  icon: (
                    <FiLayers />
                  ),
                  color:
                    "text-emerald-400",
                  bg:
                    "bg-emerald-500/10",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg border px-3 py-2.5 flex items-center justify-between ${
                    isDark
                      ? "bg-slate-900/30 border-white/5"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs ${item.bg} ${item.color}`}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h4 className="text-[13px] font-medium">
                        {item.title}
                      </h4>

                      <p className="text-[10px] text-slate-500 mt-1">
                        {item.records}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-400">
                      Ready
                    </span>

                    <FiCheckCircle className="text-emerald-400 text-[10px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PIPELINE */}
          <div
            className={`rounded-xl border p-4 ${
              isDark
                ? "bg-[#0B1120] border-white/5"
                : "bg-white border-slate-200"
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">
                  Pipeline Validation
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  Real-time ingestion
                  execution
                </p>
              </div>

              <div className="text-right">
                <p className="text-cyan-400 text-xl font-bold">
                  {progress}%
                </p>

                <p className="text-[10px] text-slate-500">
                  Progress
                </p>
              </div>
            </div>

            {/* BAR */}
            <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {/* STEPS */}
            <div className="grid grid-cols-4 gap-3 mt-5">
              {[
                "Read Source",
                "Validate",
                "Transform",
                "Warehouse Load",
              ].map((step, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 border ${
                    isDark
                      ? "bg-slate-900/40 border-white/5"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400">
                      Step {i + 1}
                    </p>

                    <FiCheckCircle className="text-emerald-400 text-xs" />
                  </div>

                  <h4 className="mt-2 text-[12px] font-medium">
                    {step}
                  </h4>
                </div>
              ))}
            </div>

            {/* STATUS */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {progress > 0 &&
                  progress < 100 && (
                    <FiLoader className="animate-spin text-cyan-400 text-[10px]" />
                  )}

                <span className="text-[11px] text-slate-400">
                  {status}
                </span>
              </div>

              <button
                onClick={startPipeline}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[11px] font-medium"
              >
                Run Validation
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-2.5">
          {/* METADATA */}
          <div
            className={`rounded-xl border p-3.5 ${
              isDark
                ? "bg-[#0B1120] border-white/5"
                : "bg-white border-slate-200"
            }`}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">
                  Detected Metadata
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  Auto-detected schema
                </p>
              </div>

              <div className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px]">
                18 Fields
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-hidden rounded-lg border border-white/5">
              {/* HEADERS */}
              <div
                className={`grid grid-cols-[1.1fr_0.8fr_0.6fr] px-3 py-2 text-[9px] uppercase tracking-wide ${
                  isDark
                    ? "bg-white/[0.03] text-slate-500"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span>Field</span>
                <span>Type</span>
                <span>Status</span>
              </div>

              {/* SCROLL AREA */}
              <div className="max-h-[240px] overflow-y-auto">
                {[
                  {
                    field:
                      "customer_id",
                    type: "STRING",
                  },
                  {
                    field: "meter_id",
                    type: "STRING",
                  },
                  {
                    field:
                      "consumption_kwh",
                    type: "FLOAT",
                  },
                  {
                    field:
                      "tariff_code",
                    type: "STRING",
                  },
                  {
                    field: "region",
                    type: "STRING",
                  },
                  {
                    field: "timestamp",
                    type: "DATETIME",
                  },
                  {
                    field:
                      "feeder_id",
                    type: "STRING",
                  },
                  {
                    field:
                      "transformer_id",
                    type: "STRING",
                  },
                  {
                    field:
                      "utility_code",
                    type: "STRING",
                  },
                  {
                    field:
                      "temperature",
                    type: "FLOAT",
                  },
                  {
                    field:
                      "weather_zone",
                    type: "STRING",
                  },
                  {
                    field:
                      "market_price",
                    type: "FLOAT",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[1.1fr_0.8fr_0.6fr] px-3 py-2 text-[10px] border-t ${
                      isDark
                        ? "border-white/5 hover:bg-white/[0.02]"
                        : "border-slate-200 hover:bg-slate-50"
                    } transition-all`}
                  >
                    <span className="font-medium">
                      {item.field}
                    </span>

                    <span className="text-slate-400">
                      {item.type}
                    </span>

                    <span className="text-emerald-400">
                      Valid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUALITY */}
          <div
            className={`rounded-xl border p-3.5 ${
              isDark
                ? "bg-[#0B1120] border-white/5"
                : "bg-white border-slate-200"
            }`}
          >
            <h3 className="text-sm font-semibold">
              Data Quality
            </h3>

            <p className="text-[11px] text-slate-500 mt-1">
              Validation overview
            </p>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                {
                  label: "Missing",
                  value: "1.2%",
                },
                {
                  label: "Tariffs",
                  value: "0.3%",
                },
                {
                  label: "Duplicates",
                  value: "0.1%",
                },
                {
                  label: "Invalid",
                  value: "0.2%",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`rounded-md p-2.5 ${
                    isDark
                      ? "bg-slate-900/40"
                      : "bg-slate-100"
                  }`}
                >
                  <p className="text-[9px] uppercase text-slate-500">
                    {item.label}
                  </p>

                  <h4 className="text-base font-bold mt-1">
                    {item.value}
                  </h4>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2.5 flex items-start gap-2">
              <FiCheckCircle className="text-emerald-400 text-xs mt-0.5" />

              <div>
                <p className="text-emerald-400 text-[11px] font-medium">
                  Validation passed
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Ready for downstream
                  analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}