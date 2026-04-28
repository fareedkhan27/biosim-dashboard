import { useState, useCallback } from "react";
import { Header } from "@/sections/Header";
import { KPICards } from "@/sections/KPICards";
import { NoiseAlert } from "@/sections/NoiseAlert";
import { FilterBar } from "@/sections/FilterBar";
import { ThreatHeatmap } from "@/sections/ThreatHeatmap";
import { SignalTimeline } from "@/sections/SignalTimeline";
import { CompetitorTracker } from "@/sections/CompetitorTracker";
import { RegionalBreakdown } from "@/sections/RegionalBreakdown";
import { SourceHealth } from "@/sections/SourceHealth";
import { AuditFooter } from "@/sections/AuditFooter";
import { RefreshToast } from "@/components/RefreshToast";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import {
  DashboardRefreshProvider,
  useDashboardRefresh,
} from "@/providers/DashboardRefreshContext";

function Dashboard() {
  const { region, operatingModel, setFilter, availableModels, availableRegions } =
    useDashboardFilters();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { lastUpdated, refresh, setInteracting } = useDashboardRefresh();

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refresh();
    setTimeout(() => setIsRefreshing(false), 2000);
  }, [refresh]);

  const handleFilterChange = useCallback(
    (type: "region" | "operatingModel", value: string) => {
      setInteracting(true);
      setFilter(type, value);
    },
    [setFilter, setInteracting]
  );

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-inter">
      <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
      <RefreshToast visible={isRefreshing} />

      <main className="pt-[100px] pb-12 space-y-10">
        {/* Section 2: KPI Cards */}
        <section>
          <KPICards />
        </section>

        {/* Section 3: Noise Alert */}
        <section>
          <NoiseAlert count={0} />
        </section>

        {/* Section 4: Filter Bar */}
        <section>
          <FilterBar
            region={region}
            operatingModel={operatingModel}
            availableModels={availableModels}
            availableRegions={availableRegions}
            onFilterChange={handleFilterChange}
          />
        </section>

        {/* Section 5: Threat Heatmap */}
        <section>
          <ThreatHeatmap region={region} operatingModel={operatingModel} />
        </section>

        {/* Section 6: Signal Timeline */}
        <section>
          <SignalTimeline region={region} operatingModel={operatingModel} />
        </section>

        {/* Section 7: Competitor Tracker */}
        <section>
          <CompetitorTracker region={region} operatingModel={operatingModel} />
        </section>

        {/* Section 8: Regional Breakdown */}
        <section>
          <RegionalBreakdown region={region} operatingModel={operatingModel} />
        </section>

        {/* Section 9: Source Health */}
        <section>
          <SourceHealth />
        </section>
      </main>

      {/* Section 10: Audit Footer */}
      <AuditFooter />
    </div>
  );
}

export default function Home() {
  return (
    <DashboardRefreshProvider>
      <Dashboard />
    </DashboardRefreshProvider>
  );
}
