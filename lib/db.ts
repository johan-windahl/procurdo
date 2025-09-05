// Database client supporting Neon (HTTP) and local Postgres (pg)
// Note: requires installing packages:
//  - drizzle-orm
//  - drizzle-kit (dev)
//  - @neondatabase/serverless (for Neon HTTP)
//  - pg (for local Postgres)
//  - dotenv (dev) for local scripts
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // Avoid throwing at import-time in edge build; consumers should handle missing DB in marketing
  // Throw only when app code actually needs DB
}

export const db = (() => {
  if (!databaseUrl) return undefined as unknown as ReturnType<typeof drizzlePg>;
  try {
    const host = new URL(databaseUrl).hostname;
    const isNeon = host.endsWith("neon.tech");
    if (isNeon) {
      const client = neon(databaseUrl);
      return drizzleNeon(client);
    }
    const pool = new Pool({ connectionString: databaseUrl });
    return drizzlePg(pool);
  } catch {
    // Fallback to pg
    const pool = new Pool({ connectionString: databaseUrl });
    return drizzlePg(pool);
  }
})();
