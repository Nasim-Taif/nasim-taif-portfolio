import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
const url = process.env.DATABASE_URL;
if (!url) throw new Error("Set DATABASE_URL in .env.local or the deployment environment.");
const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10 });
try {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("PostgreSQL migrations applied.");
} finally {
  await sql.end();
}
