import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";
import { useDashboardRefresh } from "@/providers/DashboardRefreshContext";

type SourceItem = {
  source_name: string;
  status: string;
  last_poll_timestamp: string;
  signal_count_total: number;
};

const SOURCE_URLS: Record<string, string | undefined> = {
  "ClinicalTrials.gov": "https://clinicaltrials.gov",
  "EMA EPAR": "https://www.ema.europa.eu/en/medicines",
  "openFDA": "https://open.fda.gov",
  "PubMed": "https://pubmed.ncbi.nlm.nih.gov",
  "Press Release": "https://www.biosimintel.com",
};

export function SourceHealth() {
  const { getRefetchInterval } = useDashboardRefresh();
  const { data, isLoading } = trpc.dashboard.sources.useQuery(undefined, {
    refetchInterval: getRefetchInterval,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">Source Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-dash-bg-card border border-dash-border rounded-xl p-5"
            >
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-dash-bg-card border border-dash-border rounded-xl p-5"
            >
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-3 w-14 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──  data is a flat array, not {active:[…], dormant:[…]}  ── */
  const sources: SourceItem[] = (data ?? []) as SourceItem[];
  const activeSources = sources.filter((s) => s.status === "ACTIVE");
  const dormantSources = sources.filter((s) => s.status === "DORMANT");

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-white mb-6">Source Health</h2>

      {/* Active sources */}
      <div className="mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wider text-[#34d399] mb-3">
          Active Sources ({activeSources.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {activeSources.map((s, i) => {
            const sourceUrl = SOURCE_URLS[s.source_name];
            const Card = (
              <div
                className="bg-dash-bg-card border border-dash-border rounded-xl p-5 hover:border-[#34d399] hover:shadow-[0_4px_16px_rgba(16,185,129,0.1)] transition-all duration-300 ease-dash animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <h3 className="text-sm font-semibold text-white mb-2">
                  {s.source_name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-dot" />
                  <span className="text-[11px] font-medium text-[#34d399]">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-dash-text-muted">
                  {fmtDate(s.last_poll_timestamp)} &bull;{" "}
                  {s.signal_count_total.toLocaleString()} total
                </p>
              </div>
            );
            return sourceUrl ? (
              <a
                key={s.source_name}
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline"
              >
                {Card}
              </a>
            ) : (
              <div key={s.source_name}>{Card}</div>
            );
          })}
        </div>
      </div>

      {/* Dormant sources */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wider text-dash-text-muted mb-3">
          Dormant Sources ({dormantSources.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-3 gap-4">
          {dormantSources.map((s, i) => (
            <div
              key={s.source_name}
              className="bg-dash-bg-card border border-dash-border rounded-xl p-5 opacity-60 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <h3 className="text-sm font-semibold text-white mb-2">
                {s.source_name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#6b7280]" />
                <span className="text-[11px] font-medium text-dash-text-muted">
                  DORMANT
                </span>
              </div>
              <p className="text-xs text-dash-text-muted">
                No recent poll &bull; {fmtDate(s.last_poll_timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
