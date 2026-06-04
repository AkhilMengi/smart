import { useState, useEffect } from "react";

import {
  FiUploadCloud,
  FiUsers,
  FiPieChart,
  FiActivity,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { HiOutlineLightningBolt } from "react-icons/hi";

/* SCREENS */
import DataIngestion from "./DataIngestion";
import CustomerConsumption from "./CustomerConsumption";
import TariffDistribution from "./TariffDistribution";
import DataSimulation from "./DataSimulation";

export default function Navbar({
  isDark,
  setIsDark,
}) {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  const [userName, setUserName] =
    useState("");

  const [userEmail, setUserEmail] =
    useState("");

  const [activeComponent, setActiveComponent] =
    useState("DataIngestion");

  const navItems = [
    {
      label: "Data Ingest",
      component: "DataIngestion",
      icon: <FiUploadCloud />,
    },
    {
      label: "Consumption",
      component: "CustomerConsumption",
      icon: <FiUsers />,
    },
    {
      label: "Tariff",
      component: "TariffDistribution",
      icon: <FiPieChart />,
    },
    {
      label: "Simulation",
      component: "DataSimulation",
      icon: <FiActivity />,
    },
  ];

  useEffect(() => {
    setUserName(
      localStorage.getItem("userName") ||
        "John Doe"
    );

    setUserEmail(
      localStorage.getItem("userEmail") ||
        "john@company.com"
    );
  }, []);

  const toggleTheme = () =>
    setIsDark(!isDark);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const renderComponent = () => {
    if (
      activeComponent === "DataIngestion"
    )
      return (
        <DataIngestion isDark={isDark} />
      );

    if (
      activeComponent ===
      "CustomerConsumption"
    )
      return (
        <CustomerConsumption
          isDark={isDark}
        />
      );

    if (
      activeComponent ===
      "TariffDistribution"
    )
      return (
        <TariffDistribution
          isDark={isDark}
        />
      );

    if (
      activeComponent ===
      "DataSimulation"
    )
      return (
        <DataSimulation isDark={isDark} />
      );

    return (
      <DataIngestion isDark={isDark} />
    );
  };

  return (
    <div
      className={`flex min-h-screen overflow-hidden ${
        isDark
          ? "bg-[#050816] text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r ${
          isSidebarOpen
            ? "w-[240px]"
            : "w-[78px]"
        } ${
          isDark
            ? "bg-[#070B1D] border-white/10"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* LOGO */}
          <div
            className={`h-[72px] flex items-center px-5 border-b ${
              isDark
                ? "border-white/10"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                <HiOutlineLightningBolt
                  size={18}
                />
              </div>

              {isSidebarOpen && (
                <div>
                  <h1 className="text-lg font-black">
                    Smart
                    <span className="text-cyan-400">
                      App
                    </span>
                  </h1>

                  <p className="text-[9px] uppercase tracking-[0.28em] text-slate-500">
                    analytics suite
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* NAV ITEMS */}
          <nav className="flex-1 px-3 py-5 space-y-1">
            {navItems.map((item) => {
              const active =
                activeComponent ===
                item.component;

              return (
                <button
                  key={item.label}
                  onClick={() =>
                    setActiveComponent(
                      item.component
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-to-r from-cyan-500/20 to-indigo-600/20 text-cyan-400 border border-cyan-500/20"
                      : isDark
                      ? "text-slate-400 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {isSidebarOpen && (
                    <span>{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div
            className={`p-3 border-t ${
              isDark
                ? "border-white/10"
                : "border-slate-200"
            }`}
          >
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all"
            >
              <FiLogOut />

              {isSidebarOpen && (
                <span>Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen
            ? "ml-[240px]"
            : "ml-[78px]"
        }`}
      >
        {/* HEADER */}
        <header
          className={`sticky top-0 z-30 h-[72px] px-6 border-b flex items-center justify-between ${
            isDark
              ? "bg-[#050816]/90 border-white/10"
              : "bg-white border-slate-200"
          }`}
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setIsSidebarOpen(
                  !isSidebarOpen
                )
              }
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-white/5 border border-white/10"
                  : "bg-slate-100"
              }`}
            >
              {isSidebarOpen ? (
                <FiX />
              ) : (
                <FiMenu />
              )}
            </button>

            <div>
              <h2 className="text-lg font-bold">
                {
                  navItems.find(
                    (n) =>
                      n.component ===
                      activeComponent
                  )?.label
                }
              </h2>

              <p className="text-xs text-slate-500">
                Enterprise Analytics
                Dashboard
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* THEME */}
            <button
              onClick={toggleTheme}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-white/5 border border-white/10"
                  : "bg-slate-100"
              }`}
            >
              {isDark ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon />
              )}
            </button>

            {/* USER */}
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-2xl ${
                isDark
                  ? "bg-white/5 border border-white/10"
                  : "bg-white border border-slate-200"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {userName
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {userName}
                </p>

                <p className="text-xs text-slate-500">
                  Data Engineer
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="flex-1 overflow-y-auto p-5">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}