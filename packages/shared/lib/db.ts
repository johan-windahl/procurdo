// Database client for PostgreSQL with PgBouncer
// Note: requires installing packages:
//  - drizzle-orm
//  - pg (for PostgreSQL connections)
//  - dotenv (dev) for local scripts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // Avoid throwing at import-time in edge build; consumers should handle missing DB in marketing
  // Throw only when app code actually needs DB
}

export const db = (() => {
  if (!databaseUrl) return undefined as unknown as ReturnType<typeof drizzle>;

  const pool = new Pool({
    connectionString: databaseUrl,
    // Optional: Configure pool settings for PgBouncer
    max: 10, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  });

  return drizzle(pool);
})();
