import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/providers/trpc";

export function KPICards() {
  const { isLoading } = trpc.dashboard.health.useQuery();

  // Simulated KPI data - in production this would come from a dedicated endpoint
  const kpiData = {
    total_signals_30d: 1248,
    unique_events: 47,
    per_country_tags: 1201,
    active_countries: 37,
    total_countries: 37,
    watch_list_competitors: 4,
    watch_list_names: ["Zydus", "Boan", "Enzene", "Henlius"],
    dormant_sources: 4,
    dormant_source_names: ["USPTO", "EPO", "WHO", "EU CTIS"],
  };

  const cards = [
    {
      label: "TOTAL SIGNALS (30D)",
      value: kpiData.total_signals_30d.toLocaleString(),
      subtitle: `Unique events: ${kpiData.unique_events} • Per-country tags: ${kpiData.per_country_tags.toLocaleString()}`,
      valueClass: "gradient-text-blue",
    },
    {
      label: "ACTIVE COUNTRIES",
      value: `${kpiData.active_countries} / ${kpiData.total_countries}`,
      subtitle: "100% market coverage",
      valueClass: "text-[#34d399]",
    },
    {
      label: "WATCH LIST COMPETITORS",
      value: String(kpiData.watch_list_competitors),
      subtitle: kpiData.watch_list_names.join(", "),
      valueClass: "text-[#fbbf24]",
    },
    {
      label: "DORMANT SOURCES",
      value: String(kpiData.dormant_sources),
      subtitle: kpiData.dormant_source_names.join(", "),
      valueClass: "text-[#f87171]",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-dash-bg-card border border-dash-border rounded-2xl p-8">
            <Skeleton className="h-3 w-32 mb-4" />
            <Skeleton className="h-12 w-28 mb-3" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="group bg-dash-bg-card border border-dash-border rounded-2xl p-8 hover:border-dash-purple hover:shadow-card transition-all duration-300 ease-dash animate-fade-in-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[1px] text-dash-text-muted mb-4">
            {card.label}
          </p>
          <p className={`text-[42px] font-bold tracking-tight leading-none mb-3 ${card.valueClass}`}>
            {card.value}
          </p>
          <p className="text-xs text-dash-text-muted">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
