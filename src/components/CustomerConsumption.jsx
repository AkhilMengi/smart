import { useState } from "react";

import {
  FiBarChart2,
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiDownload,
  FiZap,
  FiPieChart,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function CustomerConsumption({
  isDark = true,
}) {
  const [startDate, setStartDate] =
    useState("2024-01-01");

  const [endDate, setEndDate] =
    useState("2025-12-31");

  const [segment, setSegment] =
    useState("Residential");

  const [region, setRegion] =
    useState("UK");

  const card = isDark
    ? "bg-[#0B1120] border-white/[0.05]"
    : "bg-white border-slate-200";

  /* CHART DATA */

  const hourlyData = [
    { time: "00", load: 120 },
    { time: "04", load: 95 },
    { time: "08", load: 170 },
    { time: "12", load: 150 },
    { time: "16", load: 220 },
    { time: "20", load: 310 },
    { time: "24", load: 180 },
  ];

  const portfolioMix = [
    {
      name: "Fixed",
      value: 44,
    },
    {
      name: "Flex",
      value: 28,
    },
    {
      name: "EV",
      value: 18,
    },
    {
      name: "Other",
      value: 10,
    },
  ];

  const COLORS = [
    "#38bdf8",
    "#818cf8",
    "#10b981",
    "#f59e0b",
  ];

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
          ? "bg-[#060B14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">
              Portfolio Overview
            </h1>

            <p className="text-[11px] text-slate-400 mt-1">
              Portfolio performance,
              demand trends and
              exposure analytics
            </p>
          </div>

          <button className="px-4 py-2 rounded-lg bg-cyan-500 text-white text-xs font-medium flex items-center gap-2">
            <FiDownload size={13} />
            Export Report
          </button>
        </div>

        {/* FILTERS */}
        <div
          className={`rounded-xl border p-3 ${card}`}
        >
          <div className="grid md:grid-cols-4 gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-lg text-xs border outline-none ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-lg text-xs border outline-none ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            />

            <select
              value={segment}
              onChange={(e) =>
                setSegment(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-lg text-xs border outline-none ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <option>
                Residential
              </option>

              <option>SME</option>

              <option>
                Industrial
              </option>
            </select>

            <select
              value={region}
              onChange={(e) =>
                setRegion(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-lg text-xs border outline-none ${
                isDark
                  ? "bg-slate-900 border-white/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <option>UK</option>

              <option>North</option>

              <option>South</option>

              <option>London</option>
            </select>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
          {[
            [
              "Total Customers",
              "2.3M",
              <FiUsers />,
            ],
            [
              "Annual Consumption",
              "8.4 TWh",
              <FiActivity />,
            ],
            [
              "Peak Exposure",
              "34%",
              <FiZap />,
            ],
            [
              "Procurement Cost",
              "£842M",
              <FiBarChart2 />,
            ],
            [
              "Average Bill",
              "£1,420",
              <FiTrendingUp />,
            ],
          ].map(([t, v, i], idx) => (
            <div
              key={idx}
              className={`rounded-xl border px-4 py-3 ${card}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">
                  {t}
                </span>

                <span className="text-cyan-400">
                  {i}
                </span>
              </div>

              <h2 className="text-lg font-bold mt-2">
                {v}
              </h2>

              <p className="text-[10px] text-emerald-400 mt-1">
                +1.2% vs last year
              </p>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid xl:grid-cols-[1.6fr_0.9fr] gap-3">
          {/* LEFT */}
          <div className="space-y-3">
            {/* LOAD SHAPE */}
            <div
              className={`rounded-xl border p-3.5 ${card}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Average Portfolio Load
                    Shape
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Hourly demand profile
                  </p>
                </div>

                <div className="flex gap-2 text-[10px]">
                  <button className="px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400">
                    Winter
                  </button>

                  <button className="px-2 py-1 rounded-md text-slate-500">
                    Summer
                  </button>
                </div>
              </div>

              <ResponsiveContainer
                width="100%"
                height={220}
              >
                <LineChart
                  data={hourlyData}
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
                    dataKey="load"
                    stroke="#60a5fa"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* HEATMAP */}
            <div
              className={`rounded-xl border p-3.5 ${card}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold">
                    Cost Exposure
                    Heatmap
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Market volatility
                    exposure
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-slate-500">
                    Low
                  </span>

                  <div className="flex gap-[2px]">
                    {[
                      "bg-cyan-500/20",
                      "bg-cyan-500/40",
                      "bg-cyan-500/60",
                      "bg-orange-500/70",
                      "bg-red-500/80",
                    ].map((c, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-[3px] ${c}`}
                      />
                    ))}
                  </div>

                  <span className="text-[9px] text-slate-500">
                    High
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-[40px_repeat(7,1fr)] gap-1 mb-1">
                <div />

                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].map((d) => (
                  <div
                    key={d}
                    className="text-[9px] text-center text-slate-500"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                {[
                  "00h",
                  "04h",
                  "08h",
                  "12h",
                  "16h",
                  "20h",
                ].map(
                  (
                    hour,
                    rowIndex
                  ) => (
                    <div
                      key={hour}
                      className="grid grid-cols-[40px_repeat(7,1fr)] gap-1"
                    >
                      <div className="text-[9px] text-slate-500 flex items-center">
                        {hour}
                      </div>

                      {Array.from({
                        length: 7,
                      }).map(
                        (
                          _,
                          colIndex
                        ) => {
                          const intensity =
                            (
                              rowIndex *
                                7 +
                              colIndex
                            ) %
                            5;

                          const colors =
                            [
                              "bg-cyan-500/20",
                              "bg-cyan-500/40",
                              "bg-cyan-500/60",
                              "bg-orange-500/70",
                              "bg-red-500/80",
                            ];

                          return (
                            <div
                              key={
                                colIndex
                              }
                              className={`
                            h-9 rounded-md
                            transition-all duration-200
                            hover:scale-105
                            hover:ring-1 hover:ring-cyan-400/40
                            ${colors[intensity]}
                          `}
                            />
                          );
                        }
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* BOTTOM LEFT */}
            <div className="grid md:grid-cols-2 gap-3">
              {/* REGION */}
              <div
                className={`rounded-xl border p-3.5 ${card}`}
              >
                <h3 className="text-sm font-semibold mb-4">
                  Customers by Region
                </h3>

                <div className="space-y-3">
                  {[
                    [
                      "South East",
                      72,
                    ],
                    [
                      "North West",
                      54,
                    ],
                    [
                      "West Midlands",
                      48,
                    ],
                    [
                      "Scotland",
                      31,
                    ],
                    ["London", 26],
                  ].map(
                    ([name, val], i) => (
                      <div key={i}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span>
                            {name}
                          </span>

                          <span>
                            {val}%
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{
                              width: `${val}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ENVIRONMENT */}
              <div
                className={`rounded-xl border p-3.5 ${card}`}
              >
                <h3 className="text-sm font-semibold">
                  Environmental
                  Indicators
                </h3>

                <div className="mt-4 space-y-4">
                  {[
                    [
                      "Carbon Intensity",
                      "207 gCO₂/kWh",
                    ],
                    [
                      "Renewables %",
                      "42%",
                    ],
                    [
                      "Weather Impact",
                      "+2.1%",
                    ],
                  ].map(
                    ([k, v], i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <span className="text-[11px] text-slate-400">
                          {k}
                        </span>

                        <span className="text-sm font-semibold">
                          {v}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            {/* PORTFOLIO MIX */}
            {/* <div
              className={`rounded-xl border p-3.5 ${card}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  Portfolio Mix
                </h3>

                <FiPieChart className="text-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <ResponsiveContainer
                  width="100%"
                  height={160}
                >
                  <PieChart>
                    <Pie
                      data={
                        portfolioMix
                      }
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                    >
                      {COLORS.map(
                        (
                          color,
                          index
                        ) => (
                          <Cell
                            key={index}
                            fill={
                              color
                            }
                          />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {portfolioMix.map(
                    (item, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-[11px]"
                      >
                        <span>
                          {item.name}
                        </span>

                        <span className="font-semibold">
                          {
                            item.value
                          }
                          %
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div> */}

            {/* CUSTOMER SEGMENTS */}
            <div
              className={`rounded-xl border p-3.5 ${card}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  Customer Segments
                </h3>

                <FiUsers className="text-indigo-400" />
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <ResponsiveContainer
                  width="100%"
                  height={160}
                >
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name:
                            "Residential",
                          value: 58,
                        },
                        {
                          name: "SME",
                          value: 24,
                        },
                        {
                          name:
                            "Industrial",
                          value: 18,
                        },
                      ]}
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                    >
                      {[
                        "#38bdf8",
                        "#818cf8",
                        "#10b981",
                      ].map(
                        (
                          color,
                          index
                        ) => (
                          <Cell
                            key={index}
                            fill={
                              color
                            }
                          />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {[
                    [
                      "Residential",
                      "58%",
                    ],
                    ["SME", "24%"],
                    [
                      "Industrial",
                      "18%",
                    ],
                  ].map(
                    ([n, v], i) => (
                      <div
                        key={i}
                        className="flex justify-between text-[11px]"
                      >
                        <span>
                          {n}
                        </span>

                        <span className="font-semibold">
                          {v}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* PAYMENT TYPES */}
            <div
              className={`rounded-xl border p-3.5 ${card}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">
                  Payment Types
                </h3>

                <FiBarChart2 className="text-emerald-400" />
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <ResponsiveContainer
                  width="100%"
                  height={160}
                >
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name:
                            "Direct Debit",
                          value: 64,
                        },
                        {
                          name:
                            "Prepaid",
                          value: 21,
                        },
                        {
                          name:
                            "Invoice",
                          value: 15,
                        },
                      ]}
                      innerRadius={35}
                      outerRadius={55}
                      dataKey="value"
                    >
                      {[
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                      ].map(
                        (
                          color,
                          index
                        ) => (
                          <Cell
                            key={index}
                            fill={
                              color
                            }
                          />
                        )
                      )}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {[
                    [
                      "Direct Debit",
                      "64%",
                    ],
                    [
                      "Prepaid",
                      "21%",
                    ],
                    [
                      "Invoice",
                      "15%",
                    ],
                  ].map(
                    ([n, v], i) => (
                      <div
                        key={i}
                        className="flex justify-between text-[11px]"
                      >
                        <span>
                          {n}
                        </span>

                        <span className="font-semibold">
                          {v}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* MAP */}
            <div
              className={`rounded-xl border p-3.5 ${card}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Geographic
                    Distribution
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Consumption density
                  </p>
                </div>

                <FiMapPin className="text-cyan-400" />
              </div>

              <div className="h-[220px] rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/5 flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="mx-auto text-4xl text-cyan-400 mb-3" />

                  <p className="text-sm font-medium">
                    UK Regional Map
                  </p>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Heatmap visualization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KEY INSIGHTS */}
        {/* KEY INSIGHTS */}
<div
  className={`rounded-xl border p-4 ${card}`}
>
  {/* HEADER */}
  <div className="flex items-center gap-2 mb-4">
    <FiAlertCircle className="text-cyan-400" />

    <h3 className="text-sm font-semibold">
      Key Insights
    </h3>
  </div>

  {/* INSIGHT BANNERS */}
  <div className="space-y-3">
    {[
      {
        title:
          "Peak Demand Rising",
        value: "+12.4%",
        desc:
          "Evening residential demand continues to increase across winter months.",
        color:
          "from-cyan-500/10 to-blue-500/5",
        border:
          "border-cyan-500/20",
        accent: "text-cyan-400",
      },

      {
        title:
          "Smart Meter Rollout",
        value: "91%",
        desc:
          "Smart meter penetration exceeded annual operational targets.",
        color:
          "from-emerald-500/10 to-green-500/5",
        border:
          "border-emerald-500/20",
        accent:
          "text-emerald-400",
      },

      {
        title:
          "Renewable Portfolio",
        value: "42%",
        desc:
          "Renewable sourcing increased portfolio sustainability metrics.",
        color:
          "from-violet-500/10 to-indigo-500/5",
        border:
          "border-violet-500/20",
        accent:
          "text-violet-400",
      },
    ].map((item, i) => (
      <div
        key={i}
        className={`
          relative overflow-hidden
          rounded-xl border
          bg-gradient-to-r ${item.color}
          ${item.border}
          px-4 py-3
        `}
      >
        {/* GLOW */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 blur-2xl rounded-full" />

        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${item.accent.replace(
                  "text",
                  "bg"
                )}`}
              />

              <h4 className="text-sm font-semibold">
                {item.title}
              </h4>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {item.desc}
            </p>
          </div>

          {/* RIGHT VALUE */}
          <div
            className={`text-2xl font-bold ${item.accent}`}
          >
            {item.value}
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