import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { trpc } from "@/providers/trpc";

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes("example.com")) return false;
  if (url.includes("placeholder")) return false;
  return url.startsWith("http");
}

function getTierColor(tier: number) {
  switch (tier) {
    case 1:
      return "bg-[#ef4444]";
    case 2:
      return "bg-[#f59e0b]";
    default:
      return "bg-[#60a5fa]";
  }
}

function getTierTextColor(tier: number) {
  switch (tier) {
    case 1:
      return "text-[#ef4444]";
    case 2:
      return "text-[#f59e0b]";
    default:
      return "text-[#60a5fa]";
  }
}

function getTierBadgeColor(tier: number) {
  switch (tier) {
    case 1:
      return "bg-[#ef4444]/15 text-[#ef4444]";
    case 2:
      return "bg-[#f59e0b]/15 text-[#f59e0b]";
    default:
      return "bg-[#60a5fa]/15 text-[#60a5fa]";
  }
}

export function SignalTimeline({
  region,
  operatingModel,
}: {
  region: string;
  operatingModel: string;
}) {
  const { data, isLoading } = trpc.dashboard.timeline.useQuery(
    {
      region: region === "All" ? undefined : region,
      operating_model: operatingModel === "All" ? undefined : operatingModel,
      limit: 20,
    },
    { refetchInterval: 60000 },
  );

  if (isLoading) {
    return (
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Signal Timeline
        </h2>
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-3 h-3 rounded-full shrink-0" />
              <div className="flex-1 pb-6">
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ──  data is a plain array, not {signals:[…]}  ── */
  const signals: Array<{
    id: string;
    title: string;
    tier: number;
    source_type: string;
    country_name: string;
    country_codes: string[];
    competitor_name: string | null;
    created_at: string;
    url: string | null;
  }> = (data ?? []) as any;

  if (signals.length === 0) {
    return (
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Signal Timeline
        </h2>
        <div className="bg-dash-bg-card border border-dash-border rounded-xl p-12 text-center">
          <p className="text-dash-text-muted text-sm">
            No signals found for the selected filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-white mb-6">
        Signal Timeline
      </h2>
      <div className="space-y-0">
        {signals.map((s, i) => (
          <div
            key={s.id}
            className="flex gap-4 animate-fade-in-left"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Dot + vertical line */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-3 h-3 rounded-full ${getTierColor(s.tier)} ring-4 ring-[#0a0e1a]`}
              />
              <div className="w-px flex-1 bg-[#374151] min-h-[40px]" />
            </div>

            {/* Content card */}
            <div className="flex-1 pb-6 group">
              <div className="bg-dash-bg-card border border-dash-border rounded-xl p-4 hover:bg-[#252f3f] transition-colors duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-medium text-white mb-2 leading-snug">
                      {s.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-dash-text-muted mb-2">
                      <span>
                        {s.created_at
                          ? new Date(s.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                      {s.competitor_name && (
                        <>
                          <span>&bull;</span>
                          <span className={getTierTextColor(s.tier)}>
                            {s.competitor_name}
                          </span>
                        </>
                      )}
                      <span>&bull;</span>
                      <span>
                        {s.country_codes?.slice(0, 3).join(", ")}
                        {(s.country_codes?.length ?? 0) > 3
                          ? ` +${(s.country_codes?.length ?? 0) - 3}`
                          : ""}
                      </span>
                      <span>&bull;</span>
                      <span className="text-[#6b7280]">{s.source_type}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {s.country_codes?.slice(0, 4).map((code) => (
                        <span
                          key={code}
                          className="px-2 py-0.5 bg-[#374151] text-[11px] text-dash-text-secondary rounded-md"
                        >
                          {code}
                        </span>
                      ))}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${getTierBadgeColor(s.tier)}`}
                      >
                        TIER {s.tier}
                      </span>
                    </div>
                  </div>
                  {isValidUrl(s.url) ? (
                    <a
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 text-xs text-dash-blue hover:text-[#93c5fd] transition-colors"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs text-dash-text-muted opacity-60">
                      Monitoring — No public source yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
