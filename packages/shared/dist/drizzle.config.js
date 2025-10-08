"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL || "",
    },
    strict: true,
};
//# sourceMappingURL=drizzle.config.js.map