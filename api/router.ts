import { createRouter, publicQuery } from "./middleware";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
