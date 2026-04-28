import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

function optional(name: string, defaultValue: string = ""): string {
  return process.env[name] ?? defaultValue;
}

export const env = {
  appId: optional("APP_ID", "biosim-dashboard"),
  appSecret: optional("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: optional("DATABASE_URL"),
  dashboardApiToken: process.env.DASHBOARD_API_TOKEN ?? "",
  dashboardApiBaseUrl: process.env.DASHBOARD_API_BASE_URL ?? "https://api.biosimintel.com/api/v1/dashboard",
};
