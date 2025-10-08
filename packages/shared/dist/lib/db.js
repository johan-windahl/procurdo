"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Database client supporting Neon (HTTP) and local Postgres (pg)
// Note: requires installing packages:
//  - drizzle-orm
//  - drizzle-kit (dev)
//  - @neondatabase/serverless (for Neon HTTP)
//  - pg (for local Postgres)
//  - dotenv (dev) for local scripts
const neon_http_1 = require("drizzle-orm/neon-http");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const serverless_1 = require("@neondatabase/serverless");
const pg_1 = require("pg");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    // Avoid throwing at import-time in edge build; consumers should handle missing DB in marketing
    // Throw only when app code actually needs DB
}
exports.db = (() => {
    if (!databaseUrl)
        return undefined;
    try {
        const host = new URL(databaseUrl).hostname;
        const isNeon = host.endsWith("neon.tech");
        if (isNeon) {
            const client = (0, serverless_1.neon)(databaseUrl);
            return (0, neon_http_1.drizzle)(client);
        }
        const pool = new pg_1.Pool({ connectionString: databaseUrl });
        return (0, node_postgres_1.drizzle)(pool);
    }
    catch (_a) {
        // Fallback to pg
        const pool = new pg_1.Pool({ connectionString: databaseUrl });
        return (0, node_postgres_1.drizzle)(pool);
    }
})();
//# sourceMappingURL=db.js.map