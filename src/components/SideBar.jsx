import { useState } from "react";
import {
  LayoutGrid,
  Activity,
  CheckCircle2,
  Workflow,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    title: "INTELLIGENCE",
    items: [
      {
        id: "account",
        label: "Account 360",
        icon: LayoutGrid,
      },
      {
        id: "diagnosis",
        label: "Diagnosis",
        icon: Activity,
      },
      {
        id: "resolution",
        label: "Resolution",
        icon: CheckCircle2,
      },
      {
        id: "orchestra",
        label: "Orchestra",
        icon: Workflow,
      },
    ],
  },

  {
    title: "SYSTEMS",
    items: [
      {
        id: "billing",
        label: "Billing",
        icon: Database,
      },
     
    ],
  },
];

export default function Sidebar({
  active,
  setActive,
}) {
  const [localActive, setLocalActive] =
    useState("account");
  const [collapsed, setCollapsed] = useState(false);

  const activeValue = active ?? localActive;

  const handleSetActive = (id) => {
    if (typeof setActive === "function") {
      setActive(id);
      return;
    }

    setLocalActive(id);
  };

  return (
    <aside
      className={`
        ${
          collapsed ? "w-[74px]" : "w-[220px]"
        }
        h-screen
        bg-[#0B1220]
        border-r
        border-slate-800
        text-slate-200
        transition-all
        duration-300
        ease-in-out
        flex
        flex-col
      `}
    >
      {/* HEADER */}
      <div className="px-3 py-4 border-b border-slate-800">
        
        {/* TOP */}
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2 overflow-hidden">
            
            {/* LOGO */}
            <div className="text-orange-500 text-xl font-bold tracking-tight">
              EXL
            </div>

            {!collapsed && (
              <div>
                <p className="text-xs font-semibold text-white leading-none">
                  Customer 360
                </p>

                <p className="text-[9px] tracking-[0.18em] uppercase text-slate-500 mt-1">
                  Agentic
                </p>
              </div>
            )}
          </div>

          {/* TOGGLE */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="
              w-6
              h-6
              rounded-md
              flex
              items-center
              justify-center
              hover:bg-slate-800
              transition
            "
          >
            {collapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* USER */}
        {!collapsed && (
          <div
            className="
              mt-4
              bg-slate-900/60
              border
              border-slate-800
              rounded-xl
              p-3
            "
          >
            <div className="flex items-center justify-between">
              
              <div>
                <h2 className="text-xs font-semibold text-white">
                  Eleanor Hartley
                </h2>

                <p className="text-[10px] text-slate-500 mt-1">
                  ACC-4471-8820
                </p>
              </div>

              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* HEALTH */}
            <div className="mt-3 flex items-center gap-3">
              
              <div className="relative w-9 h-9">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="#1E293B"
                    strokeWidth="3"
                    fill="none"
                  />

                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    stroke="#F97316"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="88"
                    strokeDashoffset="52"
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-semibold">
                    38
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.15em] text-slate-500">
                  Health
                </p>

                <p className="text-[11px] font-medium text-orange-400 mt-0.5">
                  At Risk
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className="mb-5"
          >
            {!collapsed && (
              <p
                className="
                  px-3
                  mb-2
                  text-[9px]
                  uppercase
                  tracking-[0.18em]
                  text-slate-500
                "
              >
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeValue === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      handleSetActive(item.id)
                    }
                    className={`
                      relative
                      w-full
                      flex
                      items-center
                      ${
                        collapsed
                          ? "justify-center"
                          : "gap-3"
                      }
                      px-3
                      py-2.5
                      rounded-xl
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            bg-slate-800
                            text-white
                          `
                          : `
                            text-slate-400
                            hover:bg-slate-800/70
                            hover:text-white
                          `
                      }
                    `}
                  >
                    {/* ACTIVE INDICATOR */}
                    <div
                      className={`
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        w-[3px]
                        h-4
                        rounded-r-full
                        bg-orange-400
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "opacity-100"
                            : "opacity-0"
                        }
                      `}
                    />

                    {/* ICON */}
                    <Icon
                      size={16}
                      className={`
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? "text-orange-400"
                            : ""
                        }
                      `}
                    />

                    {/* LABEL */}
                    {!collapsed && (
                      <span className="text-[12px] font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="px-3 py-3 border-t border-slate-800">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            
            <div>
              <p className="text-[9px] text-slate-500">
                v2.4.0
              </p>

              <p className="text-[9px] text-emerald-400 mt-1">
                7 agents online
              </p>
            </div>

            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}