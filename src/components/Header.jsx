import {
  Search,
  Bell,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function Header() {
  return (
    <header
      className="
        h-[72px]
        bg-[#0B1220]
        border-b
        border-slate-800
        px-6
        flex
        items-center
        justify-between
        sticky
        top-0
        z-50
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        <div>
          <h1 className="text-lg font-semibold text-white">
            Customer 360
          </h1>

          <p className="text-xs text-slate-400 mt-0.5">
            Agentic Resolution Dashboard
          </p>
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center px-8">
        
        <div className="w-full max-w-xl relative">
          
          {/* SEARCH ICON */}
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          {/* INPUT */}
          <input
            type="text"
            placeholder="Search customers, workflows, tickets..."
            className="
              w-full
              h-11
              rounded-2xl
              bg-slate-900
              border
              border-slate-800
              pl-11
              pr-4
              text-sm
              text-slate-200
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-200

              focus:border-orange-500
              focus:ring-4
              focus:ring-orange-500/10
              focus:bg-slate-950
            "
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        
        {/* NOTIFICATIONS */}
        <button
          className="
            relative
            w-10
            h-10
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            hover:bg-slate-800
            transition-all
            duration-200
            flex
            items-center
            justify-center
          "
        >
          <Bell
            size={18}
            className="text-slate-300"
          />

          {/* DOT */}
          <div
            className="
              absolute
              top-2.5
              right-2.5
              w-2
              h-2
              rounded-full
              bg-orange-500
            "
          />
        </button>

        {/* SETTINGS */}
        <button
          className="
            w-10
            h-10
            rounded-xl
            bg-slate-900
            border
            border-slate-800
            hover:bg-slate-800
            transition-all
            duration-200
            flex
            items-center
            justify-center
          "
        >
          <Settings
            size={18}
            className="text-slate-300"
          />
        </button>

        {/* USER PROFILE */}
        <button
          className="
            flex
            items-center
            gap-3
            pl-2
            pr-3
            h-11
            rounded-2xl
            bg-slate-900
            border
            border-slate-800
            hover:bg-slate-800
            transition-all
            duration-200
          "
        >
          {/* AVATAR */}
          <div
            className="
              w-8
              h-8
              rounded-xl
              bg-gradient-to-br
              from-orange-400
              to-orange-500
              text-white
              flex
              items-center
              justify-center
              text-xs
              font-semibold
            "
          >
            EH
          </div>

          {/* NAME */}
          <div className="hidden md:block text-left">
            
            <p className="text-sm font-medium text-white leading-none">
              Eleanor Hartley
            </p>

            <p className="text-[11px] text-slate-400 mt-1">
              Administrator
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-slate-500"
          />
        </button>
      </div>
    </header>
  );
}