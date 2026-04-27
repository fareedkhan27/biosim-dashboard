import { useEffect, useState } from "react";

export function AuditFooter() {
  const [refreshTime, setRefreshTime] = useState("");

  useEffect(() => {
    const update = () => {
      setRefreshTime(new Date().toLocaleString("en-US", { timeZoneName: "short" }).replace(" GMT", " UTC"));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-dash-border py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
        <div className="space-y-1 text-xs text-[#4b5563]">
          <p>🔬 Scope: Nivolumab (Opdivo) + Ipilimumab (Yervoy) only</p>
          <p>📊 Signal counts: Per-country GeoSignal rows, last 30 days</p>
          <p>🎯 Threat scores: From CompetitorCapability table per country</p>
          <p>✅ Competitor assignments: Verified via CompetitorMoleculeAssignment</p>
          <p>🔄 Last refresh: {refreshTime}</p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-dash-text-muted">
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Settings</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Export Report</a>
        </div>
      </div>
    </footer>
  );
}
