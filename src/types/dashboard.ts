export interface HeatmapCountry {
  code: string;
  name: string;
  region: string;
  signals: number;
  threat_level: "HIGH" | "MEDIUM" | "LOW" | "MONITORING";
  threat_score: number;
  top_competitor: string;
}

export interface HeatmapData {
  countries: HeatmapCountry[];
  total: number;
}

export interface TimelineSignal {
  id: string;
  title: string;
  date: string;
  competitor: string | null;
  countries: string[];
  tier: number;
  source_type: string;
  source_url: string;
}

export interface TimelineData {
  signals: TimelineSignal[];
}

export interface Competitor {
  name: string;
  watch_list: boolean;
  molecules: string[];
  active_countries: number;
  latest_signal: string;
  latest_signal_date: string;
  total_signals: number;
}

export interface CompetitorData {
  competitors: Competitor[];
}

export interface RegionData {
  name: string;
  country_count: number;
  signals_7d: number;
  signals_30d: number;
  avg_threat: number;
  top_country: string;
  top_competitor: string;
}

export interface RegionsData {
  regions: RegionData[];
  russia?: RegionData;
}

export interface ActiveSource {
  name: string;
  status: "ACTIVE";
  last_poll: string;
  total_polls: number;
  trend: number[];
}

export interface DormantSource {
  name: string;
  status: "DORMANT";
  reason: string;
  last_poll: string;
}

export interface SourcesData {
  active: ActiveSource[];
  dormant: DormantSource[];
}

export interface KPIData {
  total_signals_30d: number;
  unique_events: number;
  per_country_tags: number;
  active_countries: number;
  total_countries: number;
  watch_list_competitors: number;
  watch_list_names: string[];
  dormant_sources: number;
  dormant_source_names: string[];
  pending_noise_count: number;
}

export type RegionFilter = "All" | "CEE_EU" | "LATAM" | "MEA" | "Russia";
export type OperatingModelFilter = "All" | "LPM" | "OPM" | "Passive";

export interface DashboardFilters {
  region: RegionFilter;
  operatingModel: OperatingModelFilter;
}
