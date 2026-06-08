import { useState } from "react";

import Sidebar from "./components/SideBar";
import Header from "./components/Header";

import HistogramChart from "./components/HistogramChart";
import ScenarioSimulator from "./components/DataSimulation";
import CustomerSegments from "./components/CustomerSegment";
import DataIngestion from "./components/DataIngestion";
import BillingCard from "./components/BillingCard";

export default function App() {
  const [activeScreen, setActiveScreen] =
    useState("account");

  // SCREEN RENDERING
  const screens = {
    account: <HistogramChart />,
    diagnosis: <ScenarioSimulator />,
    resolution: <CustomerSegments isDark />,
    orchestra: <DataIngestion isDark />,
    billing: <BillingCard isDark />,
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      
      {/* SIDEBAR */}
      <Sidebar
        active={activeScreen}
        setActive={setActiveScreen}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-5">
          {screens[activeScreen] ?? (
            <HistogramChart />
          )}
        </main>
      </div>
    </div>
  );
}