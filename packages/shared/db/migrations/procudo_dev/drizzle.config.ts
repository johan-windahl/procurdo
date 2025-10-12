import type { Config } from "drizzle-kit";

export default {
    schema: "./db/schema/procudo.ts",
    out: "./db/migrations/procudo_dev",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.MIGRATION_DATABASE_URL_PROCUDO_DEV!,
    },
    strict: true,
} satisfies Config;
