import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { env } from "../lib/env";

const API_BASE = env.dashboardApiBaseUrl;
const API_TOKEN = env.dashboardApiToken;

async function fetchDashboard(
  path: string,
  params?: Record<string, string | undefined>,
) {
  const url = new URL(
    path.replace(/^\//, ""),
    API_BASE.endsWith("/") ? API_BASE : API_BASE + "/",
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (API_TOKEN) {
    headers["X-API-Key"] = API_TOKEN;
  }

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) {
    throw new Error(`Dashboard API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const dashboardRouter = createRouter({
  /* ------------------------------------------------------------------ */
  /*  heatmap  –  GET /heatmap?region=&operating_model=                  */
  /* ------------------------------------------------------------------ */
  heatmap: publicQuery
    .input(
      z
        .object({
          region: z.string().optional(),
          operating_model: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        return await fetchDashboard("heatmap", {
          region: input?.region,
          operating_model: input?.operating_model,
        });
      } catch {
        return [];
      }
    }),

  /* ------------------------------------------------------------------ */
  /*  timeline  –  GET /timeline?region=&operating_model=&limit=         */
  /* ------------------------------------------------------------------ */
  timeline: publicQuery
    .input(
      z
        .object({
          region: z.string().optional(),
          operating_model: z.string().optional(),
          limit: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        return await fetchDashboard("timeline", {
          region: input?.region,
          operating_model: input?.operating_model,
          limit: String(input?.limit ?? 20),
        });
      } catch {
        return [];
      }
    }),

  /* ------------------------------------------------------------------ */
  /*  competitors  –  GET /competitors?region=&operating_model=          */
  /* ------------------------------------------------------------------ */
  competitors: publicQuery
    .input(
      z
        .object({ region: z.string().optional(), operating_model: z.string().optional() })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        return await fetchDashboard("competitors", {
          region: input?.region,
          operating_model: input?.operating_model,
        });
      } catch {
        return [];
      }
    }),

  /* ------------------------------------------------------------------ */
  /*  regions  –  GET /regions?region=&operating_model=                   */
  /* ------------------------------------------------------------------ */
  regions: publicQuery
    .input(
      z
        .object({ region: z.string().optional(), operating_model: z.string().optional() })
        .optional(),
    )
    .query(async ({ input }) => {
      try {
        return await fetchDashboard("regions", {
          region: input?.region,
          operating_model: input?.operating_model,
        });
      } catch {
        return [];
      }
    }),

  /* ------------------------------------------------------------------ */
  /*  sources  –  GET /sources                                             */
  /* ------------------------------------------------------------------ */
  sources: publicQuery.query(async () => {
    try {
      return await fetchDashboard("sources");
    } catch {
      return [];
    }
  }),

  /* ------------------------------------------------------------------ */
  /*  health  –  GET /summary                                              */
  /* ------------------------------------------------------------------ */
  health: publicQuery.query(async () => {
    try {
      return await fetchDashboard("summary");
    } catch {
      return { status: "error", timestamp: new Date().toISOString() };
    }
  }),
});
