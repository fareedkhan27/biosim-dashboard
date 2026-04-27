import { useState, useCallback, useMemo } from "react";
import type { RegionFilter, OperatingModelFilter } from "@/types/dashboard";

/* ── Region → valid models ── */
const REGION_MODELS: Record<RegionFilter, OperatingModelFilter[]> = {
  All:      ["All", "LPM", "OPM", "Passive"],
  CEE_EU:   ["All", "LPM", "OPM"],
  LATAM:    ["All", "LPM", "Passive"],
  MEA:      ["All", "LPM", "Passive"],
  Russia:   ["All", "LPM"],
};

/* ── Model → valid regions ── */
const MODEL_REGIONS: Record<OperatingModelFilter, RegionFilter[]> = {
  All:     ["All", "CEE_EU", "LATAM", "MEA", "Russia"],
  LPM:     ["All", "CEE_EU", "LATAM", "MEA", "Russia"],
  OPM:     ["All", "CEE_EU"],
  Passive: ["All", "LATAM", "MEA"],
};

export function useDashboardFilters() {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [operatingModel, setOperatingModel] = useState<OperatingModelFilter>("All");

  const availableModels = useMemo(() => REGION_MODELS[region], [region]);
  const availableRegions = useMemo(() => MODEL_REGIONS[operatingModel], [operatingModel]);

  const setFilter = useCallback((type: "region" | "operatingModel", value: string) => {
    if (type === "region") {
      const newRegion = value as RegionFilter;
      setRegion(newRegion);
      /* Auto-reset model if it doesn't exist in the new region */
      const validModels = REGION_MODELS[newRegion];
      if (!validModels.includes(operatingModel)) {
        setOperatingModel("All");
      }
    } else {
      const newModel = value as OperatingModelFilter;
      setOperatingModel(newModel);
      /* Auto-reset region if it doesn't exist under the new model */
      const validRegions = MODEL_REGIONS[newModel];
      if (!validRegions.includes(region)) {
        setRegion("All");
      }
    }
  }, [region, operatingModel]);

  return {
    region,
    operatingModel,
    setFilter,
    availableModels,
    availableRegions,
    params: {
      region: region === "All" ? undefined : region,
      operating_model: operatingModel === "All" ? undefined : operatingModel,
    },
  };
}
