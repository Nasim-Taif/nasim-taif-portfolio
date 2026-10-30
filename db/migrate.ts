import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not configured.");

const sql = postgres(url, { prepare: false });
const migration = await fs.readFile(path.join(process.cwd(), "drizzle/0000_portfolio_postgres.sql"), "utf8");
await sql.unsafe(migration);
await sql.end();
console.log("Database migration applied.");
