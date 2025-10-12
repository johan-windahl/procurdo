import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema/procudo.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  strict: true,
} satisfies Config;
