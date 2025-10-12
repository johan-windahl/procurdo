import type { Config } from "drizzle-kit";

export default {
    schema: "../../schema.ts",
    out: ".",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.MIGRATION_DATABASE_URL_PROCUDO_DEV!,
    },
    strict: true,
} satisfies Config;
