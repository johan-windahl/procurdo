// Database client for PostgreSQL with PgBouncer
// Note: requires installing packages:
//  - drizzle-orm
//  - pg (for PostgreSQL connections)
//  - dotenv (dev) for local scripts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl, getAllDatabaseConfigs, type DatabaseName } from "./db-config";

// Cache for database connections
const dbInstances = new Map<DatabaseName, ReturnType<typeof drizzle>>();

function createDatabaseConnection(dbName: DatabaseName) {
  const databaseUrl = getDatabaseUrl(dbName);

  if (!databaseUrl) {
    throw new Error(`Database URL not found for ${dbName}`);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    // Optional: Configure pool settings for PgBouncer
    max: 10, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
  });

  return drizzle(pool);
}

export function getDatabase(dbName?: DatabaseName) {
  const targetDb = dbName || 'procudo_dev';

  if (!dbInstances.has(targetDb)) {
    dbInstances.set(targetDb, createDatabaseConnection(targetDb));
  }

  return dbInstances.get(targetDb)!;
}

// Default export for backward compatibility
export const db = getDatabase();

// Export all available database connections
export const databases = getAllDatabaseConfigs().reduce((acc, config) => {
  acc[config.name] = getDatabase(config.name);
  return acc;
}, {} as Record<DatabaseName, ReturnType<typeof drizzle>>);

// Helper function to get a specific database by name
export function getDb(dbName: DatabaseName) {
  return getDatabase(dbName);
}
