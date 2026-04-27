import type { RegionFilter, OperatingModelFilter } from "@/types/dashboard";

interface FilterBarProps {
  region: RegionFilter;
  operatingModel: OperatingModelFilter;
  availableModels: OperatingModelFilter[];
  availableRegions: RegionFilter[];
  onFilterChange: (type: "region" | "operatingModel", value: string) => void;
}

const regions: { value: RegionFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "CEE_EU", label: "CEE/EU" },
  { value: "LATAM", label: "LATAM" },
  { value: "MEA", label: "MEA" },
  { value: "Russia", label: "Russia" },
];

const operatingModels: { value: OperatingModelFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "LPM", label: "LPM" },
  { value: "OPM", label: "OPM" },
  { value: "Passive", label: "Passive" },
];

export function FilterBar({ region, operatingModel, availableModels, availableRegions, onFilterChange }: FilterBarProps) {
  return (
    <div className="sticky top-[73px] z-40 bg-[#0a0e1a]/80 backdrop-blur-xl border-y border-dash-border py-4">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Region filters */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-dash-text-muted shrink-0 w-14">
            Region
          </span>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {regions.map((r) => {
              const isActive = region === r.value;
              const isAvailable = availableRegions.includes(r.value);
              return (
                <button
                  key={r.value}
                  onClick={() => isAvailable && onFilterChange("region", r.value)}
                  disabled={!isAvailable}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ease-dash ${
                    isActive
                      ? "bg-dash-purple text-white shadow-lg shadow-dash-purple/25"
                      : !isAvailable
                      ? "bg-dash-bg-card text-dash-text-muted opacity-35 cursor-not-allowed pointer-events-none"
                      : "bg-dash-bg-card text-[#9ca3af] hover:text-white hover:bg-[#374151]"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operating Model filters */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-dash-text-muted shrink-0 w-14">
            Model
          </span>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {operatingModels.map((m) => {
              const isActive = operatingModel === m.value;
              const isAvailable = availableModels.includes(m.value);
              return (
                <button
                  key={m.value}
                  onClick={() => isAvailable && onFilterChange("operatingModel", m.value)}
                  disabled={!isAvailable}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ease-dash ${
                    isActive
                      ? "bg-dash-purple text-white shadow-lg shadow-dash-purple/25"
                      : !isAvailable
                      ? "bg-dash-bg-card text-dash-text-muted opacity-35 cursor-not-allowed pointer-events-none"
                      : "bg-dash-bg-card text-[#9ca3af] hover:text-white hover:bg-[#374151]"
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
