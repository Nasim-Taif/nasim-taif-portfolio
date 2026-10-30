import postgres from "postgres";

let client: postgres.Sql | undefined;

export function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  client ??= postgres(url, { prepare: false });
  return client;
}
