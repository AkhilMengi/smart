import { useState } from "react";

import {
  FiUsers,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
  FiDownload,
  FiArrowRight,
  FiActivity,
  FiTarget,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

export default function TariffRecommendation({
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

  const input = isDark
    ? "bg-slate-900 border-white/10 text-white"
    : "bg-white border-slate-200";

  const [portfolio, setPortfolio] =
    useState(
      "British Gas Residential"
    );

  const loadData = [
    {
      time: "00",
      before: 0.7,
      after: 0.5,
    },

    {
      time: "04",
      before: 0.6,
      after: 0.4,
    },

    {
      time: "08",
      before: 1.0,
      after: 0.8,
    },

    {
      time: "12",
      before: 1.1,
      after: 0.9,
    },

    {
      time: "16",
      before: 1.2,
      after: 1.0,
    },

    {
      time: "20",
      before: 1.7,
      after: 1.1,
    },
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
          className={`px-3 py-2 rounded-xl border text-xs ${
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
      <div className="max-w-7xl mx-auto space-y-4">
        {/* HEADER */}

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Tariff Recommendation
            </h1>

            <p className="text-[11px] text-slate-400 mt-1">
              Intelligent tariff optimisation and customer recommendation engine
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={portfolio}
              onChange={(e) =>
                setPortfolio(
                  e.target.value
                )
              }
              className={`px-3 py-2 rounded-xl text-xs border outline-none ${input}`}
            >
              <option>
                British Gas Residential
              </option>

              <option>
                Commercial Portfolio
              </option>
            </select>

            <button className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-cyan-500/20">
              <FiDownload size={13} />
              Export
            </button>
          </div>
        </div>

        {/* HERO SUMMARY */}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            {
              label:
                "Customers in Segment",
              value: "320K",
              sub: "Evening Peakers",
              icon: <FiUsers />,
            },

            {
              label:
                "Recommended Tariff",
              value: "Peak Escape",
              sub: "AI selected",
              icon: <FiCheckCircle />,
            },

            {
              label:
                "Avg Customer Savings",
              value: "£240",
              sub: "annual",
              icon: <FiTrendingUp />,
            },

            {
              label:
                "Peak Reduction",
              value: "-18%",
              sub: "18:00-19:00",
              icon: <FiActivity />,
            },

            {
              label:
                "Recommendation Confidence",
              value: "92%",
              sub: "high confidence",
              icon: <FiTarget />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`rounded-3xl border p-4 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>

                  <span className="text-cyan-400">
                    {item.icon}
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight mt-3">
                  {item.value}
                </h2>

                <p className="text-[11px] text-slate-500 mt-1">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN LAYOUT */}

        {/* TARIFF RECOMMENDATION ENGINE */}

<div
  className={`rounded-3xl border p-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.015] before:to-transparent before:pointer-events-none ${card}`}
>
  {/* GLOW */}

  <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-3xl rounded-full" />

  <div className="relative z-10">
    {/* HEADER */}

    <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Tariff Recommendation Engine
        </h2>

        <p className="text-[11px] text-slate-500 mt-1">
          AI ranked tariffs based on customer behaviour, flexibility and supplier economics
        </p>
      </div>

      <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-wide text-emerald-400 font-medium">
        92% Confidence
      </div>
    </div>

    {/* TOP SECTION */}

    <div className="grid xl:grid-cols-[240px_minmax(0,1fr)_300px] gap-6 items-start">
      {/* PROFILE */}

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 h-full">
        <h3 className="text-sm font-semibold mb-5">
          Customer Profile
        </h3>

        <div className="space-y-4">
          {[
            [
              "Segment",
              "Evening Peakers",
            ],

            [
              "Avg Annual Usage",
              "7,800 kWh",
            ],

            [
              "Peak 18:00-19:00",
              "38%",
            ],

            [
              "Offpeak Usage",
              "22%",
            ],

            [
              "Smart Meter %",
              "91%",
            ],

            [
              "EV Ownership",
              "16%",
            ],

            [
              "Solar Adoption",
              "9%",
            ],

            [
              "Tenure",
              "3.2 years",
            ],
          ].map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-white/5 pb-2"
            >
              <span className="text-[11px] text-slate-500">
                {item[0]}
              </span>

              <span className="text-[11px] font-medium">
                {item[1]}
              </span>
            </div>
          ))}
        </div>

        {/* MINI LOAD CURVE */}

        <div className="mt-8">
          <h4 className="text-[11px] text-slate-400 mb-3">
            Average Daily Load
          </h4>

          <ResponsiveContainer
            width="100%"
            height={120}
          >
            <AreaChart
              data={loadData}
            >
              <Area
                dataKey="before"
                stroke="#6EE7B7"
                fill="#6EE7B7"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECOMMENDED */}

      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.08] to-transparent p-6 h-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] uppercase tracking-wide text-emerald-400 font-medium">
          <FiCheckCircle />
          Recommended Tariff
        </div>

        <h2 className="text-5xl font-bold tracking-tight mt-6">
          Peak Escape
        </h2>

        <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
          Optimised for customers with high evening demand and strong offpeak
          flexibility potential. Expected to reduce peak exposure while improving
          customer savings and supplier margin profile.
        </p>

        {/* METRICS */}

        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            [
              "Annual Bill",
              "£1,180",
            ],

            [
              "Customer Savings",
              "£240",
            ],

            [
              "Peak Reduction",
              "-18%",
            ],
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/5 bg-white/[0.04] p-4"
            >
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                {item[0]}
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {item[1]}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* WHY PANEL */}

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 h-full">
        <h3 className="text-sm font-semibold text-emerald-400">
          Why this recommendation?
        </h3>

        <div className="space-y-4 mt-6">
          {[
            "High evening peak demand behaviour",
            "Strong offpeak shifting potential",
            "91% smart meter penetration",
            "Improves supplier economics",
            "High engagement suitability",
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />

              <p className="text-xs text-slate-300 leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 transition-all text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
          Apply Recommendation
          <FiArrowRight />
        </button>
      </div>
    </div>

    {/* ALTERNATIVE TARIFFS */}

    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">
            Alternative Tariffs
          </h3>

          <p className="text-[11px] text-slate-500 mt-1">
            Ranked by suitability score and expected customer impact
          </p>
        </div>
      </div>

      <div className="grid xl:grid-cols-4 gap-4">
        {[
          {
            name: "EV Smart",
            annual: "£1,210",
            savings: "£210",
            score: "88%",
          },

          {
            name: "Time of Use",
            annual: "£1,250",
            savings: "£170",
            score: "81%",
          },

          {
            name: "Green Saver",
            annual: "£1,360",
            savings: "£60",
            score: "74%",
          },

          {
            name: "Weekend Flex",
            annual: "£1,290",
            savings: "£130",
            score: "77%",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 p-5 hover:-translate-y-[2px]"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {item.name}
              </h3>

              <div className="text-[10px] text-cyan-400 font-medium">
                {item.score}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Annual Bill
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {item.annual}
              </h2>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Potential Savings
              </p>

              <div className="text-xl font-semibold text-cyan-400 mt-2">
                {item.savings}
              </div>
            </div>

            {/* SUITABILITY */}

            <div className="mt-6">
              <div className="flex justify-between text-[10px] text-slate-500 mb-2">
                <span>
                  Suitability
                </span>

                <span>
                  {item.score}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  style={{
                    width:
                      item.score,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

{/* LOWER SECTION */}

<div className="grid xl:grid-cols-[1.4fr_0.8fr] gap-4 mt-4">
  {/* LOAD SHAPE */}

  <div
    className={`rounded-3xl border p-5 ${card}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold">
          Load Shape Impact
        </h3>

        <p className="text-[11px] text-slate-500 mt-1">
          Before vs after tariff migration
        </p>
      </div>

      <div className="text-xs text-emerald-400 font-medium">
        -18% Peak
      </div>
    </div>

    <ResponsiveContainer
      width="100%"
      height={250}
    >
      <LineChart
        data={loadData}
      >
        <CartesianGrid
          opacity={0.05}
        />

        <XAxis
          dataKey="time"
          tick={{
            fill: "#94A3B8",
            fontSize: 11,
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{
            fill: "#94A3B8",
            fontSize: 11,
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          content={tooltip}
        />

        <Line
          dataKey="before"
          stroke="#94A3B8"
          strokeWidth={2.2}
          dot={false}
        />

        <Line
          dataKey="after"
          stroke="#6EE7B7"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* FINANCIAL IMPACT */}

  <div
    className={`rounded-3xl border p-5 ${card}`}
  >
    <div>
      <h3 className="text-sm font-semibold">
        Financial Impact
      </h3>

      <p className="text-[11px] text-slate-500 mt-1">
        Portfolio and supplier economics
      </p>
    </div>

    <div className="space-y-6 mt-8">
      {[
        {
          label:
            "Supplier Margin",
          value: "+£52",
          width: "88%",
          color:
            "from-emerald-400 to-emerald-500",
        },

        {
          label:
            "Peak Reduction",
          value: "-18%",
          width: "72%",
          color:
            "from-cyan-400 to-cyan-500",
        },

        {
          label:
            "Imbalance Cost",
          value: "-£18",
          width: "64%",
          color:
            "from-indigo-400 to-indigo-500",
        },

        {
          label:
            "Carbon Reduction",
          value: "-12%",
          width: "58%",
          color:
            "from-pink-400 to-violet-400",
        },
      ].map((item, i) => (
        <div key={i}>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-slate-400">
              {item.label}
            </span>

            <span className="text-sm font-semibold">
              {item.value}
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
              style={{
                width:
                  item.width,
              }}
            />
          </div>
        </div>
      ))}
    </div>

    {/* SUMMARY */}

    <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
          <FiTrendingUp />
        </div>

        <div>
          <h4 className="text-sm font-medium">
            Portfolio Outcome
          </h4>

          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Estimated annual savings of{" "}
            <span className="text-emerald-400 font-medium">
              £2.1M
            </span>{" "}
            across the target segment with reduced evening peak exposure and improved supplier margin efficiency.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

{/* ACTION BAR */}

<div
  className={`rounded-3xl border px-5 py-4 mt-4 ${card}`}
>
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide">
        Recommendation Summary
      </p>

      <h3 className="text-lg font-semibold mt-1">
        Peak Escape expected to deliver
        <span className="text-emerald-400">
          {" "}
          £240/customer annual savings
        </span>
      </h3>

      <p className="text-[11px] text-slate-500 mt-1">
        Based on customer flexibility, peak demand behaviour and smart meter penetration
      </p>
    </div>

    <div className="flex items-center gap-3">
      <button className="px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-sm font-medium">
        Simulate Portfolio
      </button>

      <button className="px-5 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-sm font-medium">
        Export Recommendation
      </button>

      <button className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 transition-all text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-emerald-500/20">
        Apply Recommendation
        <FiArrowRight />
      </button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}