import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";

function getThreatColor(avgThreat: number) {
  if (avgThreat >= 60) return "text-[#ef4444]";
  if (avgThreat >= 40) return "text-[#f59e0b]";
  return "text-[#34d399]";
}

export function RegionalBreakdown({
  region,
  operatingModel,
}: {
  region: string;
  operatingModel: string;
}) {
  const { data, isLoading } = trpc.dashboard.regions.useQuery(
    {
      region: region === "All" ? undefined : region,
      operating_model: operatingModel === "All" ? undefined : operatingModel,
    },
    { refetchInterval: 60000 },
  );

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Regional Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-dash-bg-card border border-dash-border rounded-xl p-6"
            >
              <Skeleton className="h-6 w-24 mb-5" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const regions: Array<{
    region_code: string;
    country_count: number;
    total_signals_30d: number;
    avg_threat_score: number;
    top_country_by_threat: string;
    top_competitor_by_presence: string;
  }> = (data ?? []) as any;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-white mb-6">
        Regional Breakdown
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {regions.map((r, i) => (
          <div
            key={r.region_code}
            className="bg-dash-bg-card border border-dash-border rounded-xl p-6 hover:border-dash-purple hover:shadow-card transition-all duration-300 ease-dash animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">
                {r.region_code}
              </h3>
              <span className="px-2 py-0.5 bg-[#374151] text-[11px] text-dash-text-secondary rounded-md">
                {r.country_count} countries
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-dash-text-muted">
                  Signals (30d)
                </span>
                <span className="text-sm font-medium text-white">
                  {r.total_signals_30d.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dash-text-muted">
                  Avg Threat
                </span>
                <span
                  className={`text-sm font-bold ${getThreatColor(r.avg_threat_score)}`}
                >
                  {r.avg_threat_score.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dash-text-muted">
                  Top Country
                </span>
                <span className="text-[13px] text-[#9ca3af]">
                  {r.top_country_by_threat}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-dash-text-muted">
                  Top Competitor
                </span>
                <span className="text-[13px] text-[#9ca3af]">
                  {r.top_competitor_by_presence}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] text-[#4b5563]">
        Metrics calculated from live GeoSignal data. Updated every 60 seconds.
      </p>
    </div>
  );
}
