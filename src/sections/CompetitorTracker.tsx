import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useDashboardRefresh } from "@/providers/DashboardRefreshContext";

type SortField =
  | "name"
  | "watch_list"
  | "molecules"
  | "active_countries_count"
  | "latest_signal_date"
  | "total_signals_count";
type SortDirection = "asc" | "desc";

export function CompetitorTracker({ region, operatingModel }: { region: string; operatingModel: string }) {
  const { getRefetchInterval } = useDashboardRefresh();
  const { data, isLoading } = trpc.dashboard.competitors.useQuery(
    {
      region: region === "All" ? undefined : region,
      operating_model: operatingModel === "All" ? undefined : operatingModel,
    },
    { refetchInterval: getRefetchInterval },
  );

  const [sortField, setSortField] = useState<SortField>("total_signals_count");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const competitors: Array<{
    id: number;
    name: string;
    watch_list: boolean;
    molecules: string[];
    active_countries_count: number;
    country_codes: string[];
    latest_signal_title: string;
    latest_signal_date: string;
    total_signals_count: number;
  }> = (data ?? []) as any;

  const sorted = useMemo(() => {
    return [...competitors].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "watch_list":
          aVal = a.watch_list ? 1 : 0;
          bVal = b.watch_list ? 1 : 0;
          break;
        case "molecules":
          aVal = a.molecules.join(", ");
          bVal = b.molecules.join(", ");
          break;
        case "active_countries_count":
          aVal = a.active_countries_count;
          bVal = b.active_countries_count;
          break;
        case "latest_signal_date":
          aVal = a.latest_signal_date;
          bVal = b.latest_signal_date;
          break;
        case "total_signals_count":
          aVal = a.total_signals_count;
          bVal = b.total_signals_count;
          break;
      }

      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [competitors, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3 h-3 text-dash-text-muted" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3 h-3 text-dash-blue" />
    ) : (
      <ArrowDown className="w-3 h-3 text-dash-blue" />
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Competitor Tracker
        </h2>
        <div className="bg-dash-bg-card border border-dash-border rounded-xl overflow-hidden">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold text-white mb-6">
          Competitor Tracker
        </h2>
        <div className="bg-dash-bg-card border border-dash-border rounded-xl p-12 text-center">
          <p className="text-dash-text-muted text-sm">
            No competitors found for the selected region.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-white mb-6">
        Competitor Tracker
      </h2>
      <div className="bg-dash-bg-card border border-dash-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dash-border">
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-dash-text-muted hover:text-white transition-colors"
                  >
                    Competitor <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("watch_list")}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-dash-text-muted hover:text-white transition-colors"
                  >
                    Watch List <SortIcon field="watch_list" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("molecules")}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-dash-text-muted hover:text-white transition-colors"
                  >
                    Molecules <SortIcon field="molecules" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("active_countries_count")}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-dash-text-muted hover:text-white transition-colors"
                  >
                    Active Countries <SortIcon field="active_countries_count" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("latest_signal_date")}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-dash-text-muted hover:text-white transition-colors"
                  >
                    Latest Signal <SortIcon field="latest_signal_date" />
                  </button>
                </th>
                <th className="text-right px-6 py-4">
                  <button
                    onClick={() => handleSort("total_signals_count")}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-dash-text-muted hover:text-white transition-colors ml-auto"
                  >
                    Total Signals <SortIcon field="total_signals_count" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((comp) => (
                <tr
                  key={comp.id}
                  className="border-b border-dash-border last:border-b-0 hover:bg-[#1f2937] transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-white">
                    {comp.name}
                  </td>
                  <td className="px-6 py-4">
                    {comp.watch_list ? (
                      <span className="px-2 py-0.5 bg-[#fbbf24] text-black text-xs font-bold rounded-md">
                        Watch
                      </span>
                    ) : (
                      <span className="text-dash-text-muted text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#9ca3af]">
                    {comp.molecules.join(", ")}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span
                      className={
                        comp.active_countries_count > 0
                          ? "text-[#34d399]"
                          : "text-dash-text-muted"
                      }
                    >
                      {comp.active_countries_count}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#9ca3af] max-w-[200px] truncate">
                    {(comp.latest_signal_title?.length ?? 0) > 40
                      ? comp.latest_signal_title!.slice(0, 40) + "\u2026"
                      : comp.latest_signal_title}
                    <span className="text-dash-text-muted ml-1">
                      &bull; {comp.latest_signal_date}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-white text-right">
                    {comp.total_signals_count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
