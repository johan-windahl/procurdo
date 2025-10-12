import type { Config } from "drizzle-kit";

export default {
    schema: "./db/schema/procudo-data.ts",
    out: "./db/migrations/procudo_data_dev",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.MIGRATION_DATABASE_URL_PROCUDO_DATA_DEV!,
    },
    strict: true,
} satisfies Config;
