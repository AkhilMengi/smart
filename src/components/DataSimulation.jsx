import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import {
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiSave,
  FiDownload,
  FiPlay,
  FiSettings,
} from "react-icons/fi";

export default function ScenarioSimulator({
  isDark = true,
}) {
  const card = isDark
    ? "bg-white/[0.03] border-white/10"
    : "bg-white border-slate-200";

  const loadData = [
    {
      time: "00",
      current: 0.7,
      scenario: 0.5,
    },

    {
      time: "04",
      current: 0.6,
      scenario: 0.4,
    },

    {
      time: "08",
      current: 1.0,
      scenario: 0.8,
    },

    {
      time: "12",
      current: 1.1,
      scenario: 0.9,
    },

    {
      time: "16",
      current: 1.2,
      scenario: 1.0,
    },

    {
      time: "20",
      current: 1.8,
      scenario: 1.1,
    },
  ];

  const costData = [
    {
      name: "Current",
      procurement: 850,
      imbalance: 180,
      network: 120,
      other: 90,
    },

    {
      name: "Scenario",
      procurement: 720,
      imbalance: 140,
      network: 90,
      other: 60,
    },
  ];

  const segments = [
    {
      name: "Evening Peakers",
      customers: "320K",
      saving: "£52M",
      peak: "0.32",
      color: "#60A5FA",
    },

    {
      name: "Weekend Shifters",
      customers: "230K",
      saving: "£31M",
      peak: "0.27",
      color: "#34D399",
    },

    {
      name: "Flat Baseloaders",
      customers: "410K",
      saving: "£18M",
      peak: "0.15",
      color: "#F59E0B",
    },

    {
      name: "Solar Exporters",
      customers: "95K",
      saving: "£13M",
      peak: "0.11",
      color: "#A78BFA",
    },
  ];

  return (
    <div className="space-y-4 m-4">
      {/* HEADER */}

      {/* HEADER */}

      {/* HEADER */}

      <div
        className={`rounded-3xl border p-4 ${card} backdrop-blur-sm shadow-xl shadow-black/20`}
      >
        {/* TOP ROW */}

        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* LEFT */}

          <div>
            <h1 className="text-3xl font-bold text-slate-50">
              Scenario Simulator
            </h1>

            <p className="text-sm text-slate-400 mt-2">
              Model tariff strategies,
              behavioural changes and
              customer demand flexibility
              scenarios
            </p>
          </div>

        {/* TOP RIGHT BUTTONS */}

          <div className="flex items-center gap-3">
            <button
              className={`h-[40px] px-4 rounded-xl border text-xs font-semibold transition-all duration-300 hover:-translate-y-[1px]
        ${isDark
                  ? "bg-white/[0.05] border-white/15 hover:bg-white/[0.08] hover:border-white/25 text-slate-200"
                  : "bg-white border-slate-200"
                }`}
            >
              Compare
            </button>

            <button
              className={`h-[40px] px-4 rounded-xl border text-xs font-semibold transition-all duration-300 hover:-translate-y-[1px]
        ${isDark
                  ? "bg-white/[0.05] border-white/15 hover:bg-white/[0.08] hover:border-white/25 text-slate-200"
                  : "bg-white border-slate-200"
                }`}
            >
              Export
            </button>

            <button className="h-[40px] px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 transition-all duration-300 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-[1px]">
              <FiPlay size={13} />
              Run Simulation
            </button>
          </div>
        </div>

        {/* FILTERS */}

        <div className="flex items-center gap-4 flex-wrap mt-7">
          {/* Scenario Dropdown */}

          <div
            className={`group relative rounded-2xl border px-4 py-3.5 min-w-[240px] transition-all duration-300
      ${isDark
                ? "bg-gradient-to-br from-slate-900/60 to-slate-900/30 border-white/15 hover:border-cyan-500/40 hover:bg-gradient-to-br hover:from-slate-900/80 hover:to-slate-900/50"
                : "bg-white border-slate-200"
              }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/[0.05] to-indigo-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                Scenario
              </p>

              <select
                className={`w-full bg-transparent text-sm font-semibold mt-2.5 outline-none appearance-none cursor-pointer ${isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                  }`}
              >
                <option>
                  Peak Shift + EV Smart
                </option>

                <option>
                  Weekend Saver Campaign
                </option>

                <option>
                  Dynamic Tariff Adoption
                </option>
              </select>
            </div>
          </div>

          {/* Simulation Period */}

          <div
            className={`group relative rounded-2xl border px-4 py-3.5 min-w-[240px] transition-all duration-300
      ${isDark
                ? "bg-gradient-to-br from-slate-900/60 to-slate-900/30 border-white/15 hover:border-emerald-500/40 hover:bg-gradient-to-br hover:from-slate-900/80 hover:to-slate-900/50"
                : "bg-white border-slate-200"
              }`}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/[0.05] to-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                Simulation Period
              </p>

              <input
                type="month"
                defaultValue="2025-01"
                className={`w-full bg-transparent text-sm font-semibold mt-2.5 outline-none ${isDark
                    ? "text-slate-100"
                    : "text-slate-900"
                  }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI STRIP */}

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {[
          [
            "Total Customers",
            "2.3M",
            "+0%",
          ],

          [
            "Annual Cost",
            "£1.24B",
            "-13%",
          ],

          [
            "Annual Savings",
            "£171M",
            "+13.8%",
          ],

          [
            "Peak Demand",
            "6.21 GW",
            "-11.7%",
          ],

          [
            "Offpeak Shift",
            "5.48 TWh",
            "+14%",
          ],

          [
            "CO₂ Reduction",
            "612 kt",
            "-10%",
          ],
        ].map((item, i) => (
          <div
            key={i}
            className={`rounded-3xl border p-5 ${card} backdrop-blur-sm shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 hover:-translate-y-0.5`}
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              {item[0]}
            </p>

            <h2 className="text-2xl font-bold mt-3.5 text-slate-50">
              {item[1]}
            </h2>

            <p className={`text-xs mt-2.5 font-semibold ${item[2].includes('+') ? 'text-emerald-400' : 'text-red-400'}`}>
              {item[2]}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}

      <div className="grid xl:grid-cols-2 gap-4">
        {/* LEFT CONFIG */}

        <div className="space-y-4">
          {/* CONFIG */}

          <div
            className={`rounded-3xl border p-6 ${card} backdrop-blur-sm shadow-lg shadow-black/10`}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <FiSettings className="text-cyan-400" size={18} />

              <h3 className="font-bold text-slate-50">
                Scenario Configuration
              </h3>
            </div>

            <div className="space-y-6">
              {[
                {
                  title:
                    "Tariff Migration",
                  level:
                    "Medium",
                  value:
                    "40%",
                },

                {
                  title:
                    "Peak Shift Campaign",
                  level:
                    "High",
                  value:
                    "75%",
                },

                {
                  title:
                    "EV Smart Uptake",
                  level:
                    "Medium",
                  value:
                    "30%",
                },

                {
                  title:
                    "Behaviour Change",
                  level:
                    "Low",
                  value:
                    "10%",
                },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">
                      {item.title}
                    </span>

                    <span className="text-xs text-cyan-400">
                      {item.level}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                      style={{
                        width:
                          item.value,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEGMENTS */}

          {/* IMPACT BY SEGMENT */}

    
        </div>

        {/* RIGHT */}

        <div className="space-y-4">
          {/* LOAD SHAPE */}

          <div
            className={`rounded-3xl border p-6 ${card} backdrop-blur-sm shadow-lg shadow-black/10 h-[320px]`}
          >
            <div className="flex items-center justify-between ">
              <div>
                <h3 className="font-bold text-lg text-slate-50">
                  Load Shape Comparison
                </h3>

                <p className="text-xs text-slate-400 mt-2">
                  Current vs simulated
                  scenario
                </p>
              </div>

              <div className="text-sm text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg">
                -11.7% Peak
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
                />

                <YAxis />

                <Tooltip />

                <Line
                  dataKey="current"
                  stroke="#64748B"
                  strokeWidth={2.5}
                  dot={false}
                />

                <Line
                  dataKey="scenario"
                  stroke="#34D399"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* LOWER GRID */}

          
        </div>
      </div>
      <div className="grid xl:grid-cols-[40%_30%_30%] gap-4 items-stretch">
  
  {/* IMPACT TABLE */}
  <div
    className={`rounded-2xl border overflow-hidden shadow-xl h-full flex flex-col
    ${
      isDark
        ? "bg-[#0F172A]/85 border-white/10"
        : "bg-white border-slate-200"
    }`}
  >
    {/* Header */}
    <div
      className={`flex items-center justify-between px-5 py-4 border-b
      ${
        isDark
          ? "border-white/10 bg-white/[0.03]"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-semibold mb-1">
          Analytics
        </p>

        <h2
          className={`text-base font-semibold
          ${isDark ? "text-white" : "text-slate-900"}`}
        >
          Impact by Customer Segment
        </h2>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto flex-1">
      <table className="w-full">
        <thead>
          <tr
            className={`text-[10px] uppercase tracking-wider
            ${
              isDark
                ? "text-slate-400 bg-white/[0.02]"
                : "text-slate-500 bg-slate-50"
            }`}
          >
            <th className="text-left px-5 py-3 font-semibold">
              Segment
            </th>

            <th className="text-center px-3 py-3 font-semibold">
              Savings
            </th>

            <th className="text-right px-5 py-3 font-semibold">
              Impact
            </th>
          </tr>
        </thead>

        <tbody>
          {[
            {
              name: "Evening Peakers",
              savings: "£52M",
              impact: 88,
              color: "from-cyan-400 to-blue-500",
            },
            {
              name: "Weekend Shifters",
              savings: "£31M",
              impact: 74,
              color: "from-emerald-400 to-green-500",
            },
            {
              name: "Flat Baseloaders",
              savings: "£18M",
              impact: 58,
              color: "from-amber-400 to-orange-500",
            },
            {
              name: "Solar Exporters",
              savings: "£13M",
              impact: 46,
              color: "from-violet-400 to-fuchsia-500",
            },
          ].map((item, i) => (
            <tr
              key={i}
              className={`border-t transition-all
              ${
                isDark
                  ? "border-white/5 hover:bg-white/[0.03]"
                  : "border-slate-100 hover:bg-slate-50"
              }`}
            >
              {/* Segment */}
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl bg-gradient-to-br ${item.color}`}
                  />

                  <p
                    className={`text-sm font-medium leading-none
                    ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    {item.name}
                  </p>
                </div>
              </td>

              {/* Savings */}
              <td className="text-center">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg
                  ${
                    isDark
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {item.savings}
                </span>
              </td>

              {/* Impact */}
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-2">
                  <div
                    className={`w-24 h-2 rounded-full overflow-hidden
                    ${isDark ? "bg-slate-800" : "bg-slate-200"}`}
                  >
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{
                        width: `${item.impact}%`,
                      }}
                    />
                  </div>

                  <span
                    className={`text-xs font-semibold w-8 text-right
                    ${isDark ? "text-white" : "text-slate-700"}`}
                  >
                    {item.impact}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* COST BREAKDOWN */}
  <div
    className={`rounded-3xl border p-6 ${card} backdrop-blur-sm shadow-lg shadow-black/10 h-full flex flex-col`}
  >
    <div className="flex items-center gap-2.5 mb-6">
      <FiTrendingUp className="text-cyan-400" size={18} />

      <h3 className="font-bold text-lg text-slate-50">
        Cost Breakdown
      </h3>
    </div>

    <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={costData}>
          <CartesianGrid opacity={0.05} />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="procurement"
            stackId="a"
            fill="#60A5FA"
          />

          <Bar
            dataKey="imbalance"
            stackId="a"
            fill="#34D399"
          />

          <Bar
            dataKey="network"
            stackId="a"
            fill="#F59E0B"
          />

          <Bar
            dataKey="other"
            stackId="a"
            fill="#A78BFA"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* SENSITIVITY */}
  <div
    className={`rounded-3xl border p-6 ${card} backdrop-blur-sm shadow-lg shadow-black/10 h-full flex flex-col`}
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-bold text-lg text-slate-50">
          Sensitivity Analysis
        </h3>
      </div>

      <button className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-all duration-200 hover:underline">
        Export
      </button>
    </div>

    <div className="overflow-hidden rounded-2xl border border-white/5 backdrop-blur-sm flex-1">
      {/* HEADER */}
      <div
        className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] px-4 py-3 text-[10px] uppercase tracking-widest font-semibold border-b
        ${
          isDark
            ? "bg-gradient-to-r from-white/[0.06] to-white/[0.02] border-white/10 text-slate-400"
            : "bg-slate-100 border-slate-200 text-slate-500"
        }`}
      >
        <div>Scenario</div>

        <div className="text-center">Effect</div>

        <div className="text-center">Savings</div>

        <div className="text-center">Peak</div>
      </div>

      {/* ROWS */}
      {[
        {
          scenario: "Low Adoption",
          effectiveness: "10%",
          savings: "£66M",
          peak: "0.32 GW",
        },
        {
          scenario: "Balanced",
          effectiveness: "25%",
          savings: "£171M",
          peak: "0.82 GW",
        },
        {
          scenario: "Aggressive",
          effectiveness: "40%",
          savings: "£240M",
          peak: "1.18 GW",
        },
        {
          scenario: "Maximum",
          effectiveness: "60%",
          savings: "£334M",
          peak: "1.26 GW",
        },
      ].map((item, i) => (
        <div
          key={i}
          className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-4 py-4 text-sm border-b last:border-0 transition-all duration-200
          ${
            isDark
              ? "border-white/5 hover:bg-white/[0.04]"
              : "border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="font-semibold text-slate-100">
            {item.scenario}
          </div>

          <div className="text-center text-slate-300">
            {item.effectiveness}
          </div>

          <div className="text-center text-emerald-400 font-semibold">
            {item.savings}
          </div>

          <div className="text-center text-slate-300">
            {item.peak}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* FOOTER */}

      <div
        className={`rounded-2xl border p-4 ${card} backdrop-blur-sm shadow-lg shadow-black/10`}
      >
        <div className="flex items-center justify-between flex-wrap ">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Scenario Outcome
            </p>

            <h3 className="text-md font-bold mt-1 text-slate-50">
              Estimated annual portfolio
              savings of
              <span className="text-emerald-400">
                {" "}
                £171M
              </span>
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Combined tariff migration and
              peak shift strategies reduce
              evening demand exposure while
              improving customer economics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-6 py-3 rounded-2xl bg-white/[0.06] border border-white/20 text-sm font-semibold transition-all duration-200 hover:bg-white/[0.1] hover:border-white/30 flex items-center gap-2">
              <FiDownload size={16} />
              Export
            </button>

            <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 transition-all duration-300 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40">
              <FiSave size={16} />
              Save Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}