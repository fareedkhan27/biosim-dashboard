import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";

function getThreatColor(level: string) {
  switch (level) {
    case "HIGH":
      return "text-[#ef4444]";
    case "MEDIUM":
      return "text-[#f59e0b]";
    case "LOW":
      return "text-[#34d399]";
    default:
      return "text-[#6b7280]";
  }
}

function getThreatBarColor(level: string) {
  switch (level) {
    case "HIGH":
      return "bg-[#ef4444]";
    case "MEDIUM":
      return "bg-[#f59e0b]";
    case "LOW":
      return "bg-[#34d399]";
    default:
      return "bg-[#6b7280]";
  }
}

export function ThreatHeatmap({
  region,
  operatingModel,
}: {
  region: string;
  operatingModel: string;
}) {
  const { data, isLoading } = trpc.dashboard.heatmap.useQuery(
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
          Threat Heatmap
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-dash-bg-card border border-dash-border rounded-xl p-5"
            >
              <Skeleton className="h-4 w-8 mb-2" />
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-1 w-full mb-3" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──  data is a plain array, not {countries:[…]}  ── */
  const countries: Array<{
    country_code: string;
    country_name: string;
    region: string;
    threat_level: string;
    highest_competitor_threat_score: number;
    signal_count_30d: number;
    top_competitor_name: string;
  }> = (data ?? []) as any;

  if (countries.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Threat Heatmap
        </h2>
        <div className="bg-dash-bg-card border border-dash-border rounded-xl p-12 text-center">
          <p className="text-dash-text-muted text-sm">
            No countries match the selected filters. Try &quot;All&quot;.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-white mb-6">Threat Heatmap</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {countries.map((c, i) => (
          <div
            key={c.country_code}
            className="bg-dash-bg-card border border-dash-border rounded-xl p-5 hover:-translate-y-1 hover:border-dash-purple hover:shadow-heatmap transition-all duration-300 ease-dash animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-[10px] font-bold text-[#9ca3af] bg-[#374151]/50 px-1.5 py-0.5 rounded">
                {c.country_code}
              </span>
              <span
                className={`text-xs font-semibold ${getThreatColor(c.threat_level)}`}
              >
                {c.threat_level} ({c.highest_competitor_threat_score})
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1">
              {c.country_name}
            </h3>

            <p className="text-xs text-dash-text-muted mb-3">
              {c.region} &bull; {c.signal_count_30d} signals
            </p>

            <div className="w-full h-1 bg-[#374151] rounded-full overflow-hidden mb-3">
              <div
                className={`h-full ${getThreatBarColor(c.threat_level)} rounded-full transition-all duration-500`}
                style={{ width: `${c.highest_competitor_threat_score}%` }}
              />
            </div>

            <p className="text-xs text-dash-text-muted">
              Top:{" "}
              <span className="text-dash-text-secondary font-medium">
                {c.top_competitor_name}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
