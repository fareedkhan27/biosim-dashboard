import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

export function Header({ onRefresh }: { onRefresh: () => void }) {
  const [currentTime, setCurrentTime] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }) + " at " + now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).replace(" GMT", " UTC");
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [onRefresh]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 gradient-bg-hero border-b border-dash-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <span className="text-xl font-semibold text-white tracking-tight">
              🧬 Biosim Intelligence
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#064e3b]/40 border border-[#10b981]/30">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-glow" />
              <span className="text-[10px] font-semibold text-[#34d399] tracking-wider uppercase">LIVE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#fbbf24] text-xs font-semibold tracking-wide">
              OPDIVO (NIVOLUMAB) FOCUS
            </span>
            <span className="text-xs text-dash-text-muted hidden md:block">
              {currentTime}
            </span>
            <button
              onClick={handleRefresh}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-dash-bg-card border border-dash-border hover:border-dash-purple hover:scale-105 transition-all duration-300 ease-dash"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 text-dash-text-secondary ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        <div className="pb-3 flex items-center gap-2 text-[13px] text-dash-text-muted">
          <span>🔬</span>
          <span>Focus: Nivolumab (Opdivo) + Ipilimumab (Yervoy) biosimilar intelligence</span>
        </div>
      </div>
    </header>
  );
}
