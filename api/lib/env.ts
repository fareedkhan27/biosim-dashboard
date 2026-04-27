import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const env = {
  appId: required("APP_ID"),
  appSecret: required("APP_SECRET"),
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: required("DATABASE_URL"),
  dashboardApiToken: process.env.DASHBOARD_API_TOKEN ?? "",
  dashboardApiBaseUrl: process.env.DASHBOARD_API_BASE_URL ?? "https://api.biosimintel.com/api/v1/dashboard",
};
