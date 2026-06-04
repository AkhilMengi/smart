import { useState } from "react";

import {
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiTarget,
  FiZap,
  FiDownload,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
} from "recharts";

export default function CustomerSegments({
  isDark = true,
}) {
  const card = isDark
    ? `
      bg-gradient-to-b
      from-[#0F172A]
      to-[#0B1120]
      border-white/[0.06]
      shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
      backdrop-blur-xl
    `
    : "bg-white border-slate-200";

  const [portfolio, setPortfolio] =
    useState(
      "British Gas Residential"
    );

  const [period, setPeriod] =
    useState("Last 12 Months");

  /* KPI */

  const kpis = [
    {
      title:
        "Total Customers Analysed",
      value: "2.3M",
      sub: "100% of portfolio",
      icon: <FiUsers />,
    },
    {
      title:
        "Behavioural Clusters",
      value: "8",
      sub: "Identified",
      icon: <FiActivity />,
    },
    {
      title: "Avg Cluster Size",
      value: "287K",
      sub: "Customers",
      icon: <FiTrendingUp />,
    },
    {
      title:
        "Explained Variance",
      value: "78%",
      sub: "By clustering model",
      icon: <FiZap />,
    },
    {
      title:
        "High Flex Customers",
      value: "654K",
      sub: "28% of portfolio",
      icon: <FiTarget />,
    },
  ];

  /* CLUSTERS */

  const clusters = [
    {
      name: "Evening Peakers",
      customers: "320K",
      metric1: "Peak %",
      metric2: "38%",
      recommendation:
        "Peak Saver Campaign",
      color: "#ef4444",
    },

    {
      name: "Overnight Flexers",
      customers: "120K",
      metric1: "Offpeak %",
      metric2: "62%",
      recommendation:
        "EV Smart Migration",
      color: "#3b82f6",
    },

    {
      name: "Weekend Shifters",
      customers: "230K",
      metric1: "Weekend Ratio",
      metric2: "1.5x",
      recommendation:
        "Weekend Saver Offer",
      color: "#10b981",
    },

    {
      name: "Solar Exporters",
      customers: "95K",
      metric1: "Export %",
      metric2: "22%",
      recommendation:
        "Solar Export Optimiser",
      color: "#f59e0b",
    },

    {
      name: "High Variability",
      customers: "290K",
      metric1: "Volatility",
      metric2: "High",
      recommendation:
        "Engagement Campaign",
      color: "#ec4899",
    },

    {
      name: "Heat Pump Homes",
      customers: "180K",
      metric1: "Winter Load",
      metric2: "High",
      recommendation:
        "Heat Pump Tariff",
      color: "#f97316",
    },
  ];

  /* LOAD SHAPE */

  const loadShape = [
    {
      time: "00",
      evening: 0.6,
      flex: 0.3,
      weekend: 0.8,
      solar: 0.4,
    },

    {
      time: "04",
      evening: 0.5,
      flex: 0.2,
      weekend: 0.7,
      solar: 0.3,
    },

    {
      time: "08",
      evening: 0.9,
      flex: 0.5,
      weekend: 0.8,
      solar: 0.5,
    },

    {
      time: "12",
      evening: 1.1,
      flex: 0.6,
      weekend: 0.9,
      solar: 0.7,
    },

    {
      time: "16",
      evening: 1.0,
      flex: 0.7,
      weekend: 0.8,
      solar: 0.5,
    },

    {
      time: "20",
      evening: 1.5,
      flex: 0.9,
      weekend: 1.1,
      solar: 0.4,
    },
  ];

  /* SCATTER */

  const scatterData =
    Array.from({
      length: 50,
    }).map(() => ({
      x:
        Math.random() * 100,
      y:
        Math.random() * 100,
      z:
        Math.random() * 100,
    }));

  const tooltip = ({
    active,
    payload,
  }) => {
    if (
      active &&
      payload &&
      payload.length
    ) {
      return (
        <div
          className={`px-3 py-2 rounded-lg border text-xs ${
            isDark
              ? "bg-slate-900 border-white/10 text-white"
              : "bg-white border-slate-200"
          }`}
        >
          {payload[0].value}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        isDark
          ? "bg-[#060B14] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.06),transparent_22%)] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* HEADER */}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Customer Segments /
              Flex Clusters
            </h1>

            <p className="text-[11px] text-slate-400 mt-1">
              Discover customer
              behaviour and load
              profiles to target
              flexibility opportunities
            </p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/20">
            <FiDownload size={13} />
            Export
          </button>
        </div>

        {/* FILTER BAR */}

        <div
          className={`rounded-2xl border p-3 shadow-inner shadow-white/[0.01] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
        >
          <div className="grid md:grid-cols-4 gap-3 relative z-10">
            <select
              value={portfolio}
              onChange={(e) =>
                setPortfolio(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-xl text-xs border outline-none transition-all duration-200 hover:border-cyan-400/20 focus:ring-2 focus:ring-cyan-500/10 ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <option>
                British Gas
                Residential
              </option>

              <option>
                Commercial
              </option>
            </select>

            <select
              value={period}
              onChange={(e) =>
                setPeriod(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-xl text-xs border outline-none transition-all duration-200 hover:border-cyan-400/20 focus:ring-2 focus:ring-cyan-500/10 ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <option>
                Last 12 Months
              </option>

              <option>
                Last 6 Months
              </option>
            </select>

            <button
              className={`px-3 py-2 rounded-xl text-xs border transition-all duration-200 hover:border-cyan-400/20 ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              Cluster View
            </button>

            <button className="px-3 py-2 rounded-xl text-xs bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 text-white shadow-lg shadow-cyan-500/20">
              Run Analysis
            </button>
          </div>
        </div>

        {/* KPI */}

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          {kpis.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl border px-4 py-3 transition-all duration-300 hover:border-cyan-400/20 hover:bg-white/[0.03] hover:-translate-y-[1px] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
            >
              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                  {item.title}
                </span>

                <span className="text-cyan-400">
                  {item.icon}
                </span>
              </div>

              <h2 className="text-lg font-bold tracking-tight mt-2 relative z-10">
                {item.value}
              </h2>

              <p className="text-[10px] text-slate-500 mt-1 tracking-wide relative z-10">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

        {/* CLUSTERS */}

        <div
          className={`rounded-2xl border p-4 shadow-inner shadow-white/[0.01] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
        >
          <div className="flex items-center justify-between mb-5 relative z-10">
            <h3 className="text-sm font-semibold tracking-tight">
              Behavioural Clusters
            </h3>

            <p className="text-[10px] text-slate-500">
              Sort by:
              Cluster Size
            </p>
          </div>

          <div className="grid lg:grid-cols-3 xl:grid-cols-6 gap-3 relative z-10">
            {clusters.map(
              (cluster, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-3 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:-translate-y-[2px] group relative overflow-hidden ${
                    isDark
                      ? "bg-slate-900/40 border-white/5"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${cluster.color}15, transparent 40%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            cluster.color,
                        }}
                      />

                      <h4 className="text-xs font-semibold">
                        {
                          cluster.name
                        }
                      </h4>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight">
                      {
                        cluster.customers
                      }
                    </h2>

                    <p className="text-[10px] text-slate-500 mt-1">
                      customers
                    </p>

                    <div className="mt-4 flex justify-between text-[10px]">
                      <span>
                        {
                          cluster.metric1
                        }
                      </span>

                      <span className="font-semibold">
                        {
                          cluster.metric2
                        }
                      </span>
                    </div>

                    {/* MINI CHART */}

                    <div className="h-16 mt-4">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >
                        <LineChart
                          data={[
                            {
                              v:
                                Math.random() *
                                10,
                            },
                            {
                              v:
                                Math.random() *
                                10,
                            },
                            {
                              v:
                                Math.random() *
                                10,
                            },
                            {
                              v:
                                Math.random() *
                                10,
                            },
                            {
                              v:
                                Math.random() *
                                10,
                            },
                          ]}
                        >
                          <Line
                            type="monotone"
                            dataKey="v"
                            stroke={
                              cluster.color
                            }
                            strokeWidth={
                              2.3
                            }
                            strokeOpacity={
                              0.9
                            }
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div
  className="mt-4 text-[10px] font-medium"
  style={{
    color: cluster.color,
  }}
>
  Recommended:
</div>

<div
  className="text-[10px] mt-1 font-medium"
  style={{
    color: cluster.color,
  }}
>
  {cluster.recommendation}
</div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* LOWER GRID */}

        <div className="grid xl:grid-cols-[0.9fr_1fr_1fr] gap-3">
          {/* SCATTER */}

          <div
            className={`rounded-2xl border p-4 shadow-inner shadow-white/[0.01] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
          >
            <h3 className="text-sm font-semibold tracking-tight mb-4 relative z-10">
              Cluster Visualization
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <ScatterChart>
                <CartesianGrid
                  opacity={0.05}
                />

                <XAxis
                  type="number"
                  dataKey="x"
                  hide
                />

                <YAxis
                  type="number"
                  dataKey="y"
                  hide
                />

                <Scatter
                  data={scatterData}
                  fill="#38bdf8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* LOAD SHAPE */}

          <div
            className={`rounded-2xl border p-4 shadow-inner shadow-white/[0.01] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
          >
            <h3 className="text-sm font-semibold tracking-tight mb-4 relative z-10">
              Average Load Shape by
              Cluster
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart
                data={loadShape}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.05}
                />

                <XAxis
                  dataKey="time"
                  fontSize={10}
                />

                <YAxis
                  fontSize={10}
                />

                <Tooltip
                  content={tooltip}
                />

                <Line
                  type="monotone"
                  dataKey="evening"
                  stroke="#ef4444"
                  dot={false}
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="flex"
                  stroke="#3b82f6"
                  dot={false}
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="weekend"
                  stroke="#10b981"
                  dot={false}
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="solar"
                  stroke="#f59e0b"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* TABLE */}

          <div
            className={`rounded-2xl border p-4 shadow-inner shadow-white/[0.01] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-semibold tracking-tight">
                Cluster Summary Table
              </h3>

              <button className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-all">
                View Full
              </button>
            </div>

            <div className="space-y-3 relative z-10">
              {clusters.map(
                (cluster, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 border hover:bg-white/[0.04] transition-all duration-200 ${
                      isDark
                        ? "bg-white/[0.025] border-white/[0.03]"
                        : "bg-slate-100 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-semibold">
                          {
                            cluster.name
                          }
                        </h4>

                        <p className="text-[10px] text-slate-500 mt-1">
                          {
                            cluster.customers
                          }{" "}
                          customers
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-semibold text-cyan-400">
                          {
                            cluster.metric2
                          }
                        </div>

                        <div className="text-[10px] text-slate-500 mt-1">
                          Flexibility
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* KEY INSIGHTS */}

        <div
          className={`rounded-2xl border p-3 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
        >
          <div className="grid xl:grid-cols-3 gap-3 relative z-10">
            {[
              {
                icon: "⚡",
                title:
                  "Key Insight",
                value:
                  "Evening Peakers represent 14% of portfolio demand exposure.",
                action:
                  "Peak Saver Opportunity",
                accent:
                  "border-cyan-500/20 bg-cyan-500/[0.04]",
              },

              {
                icon: "🎯",
                title:
                  "Top Opportunity",
                value:
                  "120K overnight flexers identified as EV smart tariff candidates.",
                action:
                  "Estimated £3.8M annual savings",
                accent:
                  "border-emerald-500/20 bg-emerald-500/[0.04]",
              },

              {
                icon: "🚀",
                title:
                  "Next Step",
                value:
                  "Launch targeted engagement campaigns for high-flex customers.",
                action:
                  "View Opportunities →",
                accent:
                  "border-violet-500/20 bg-violet-500/[0.04]",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`rounded-2xl border backdrop-blur-xl relative overflow-hidden px-4 py-3 ${item.accent}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">
                      {item.icon}
                    </div>

                    <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">
                      {item.title}
                    </p>
                  </div>

                  <p className="text-[12px] leading-relaxed mt-3 text-slate-200">
                    {item.value}
                  </p>

                  <div className="mt-3 text-[11px] text-cyan-400 font-medium">
                    {item.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}