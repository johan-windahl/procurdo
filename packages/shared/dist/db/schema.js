"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alerts = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.text)("id").primaryKey(), // Clerk user ID
    email: (0, pg_core_1.text)("email"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
exports.alerts = (0, pg_core_1.pgTable)("alerts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    userId: (0, pg_core_1.text)("user_id").notNull(),
    name: (0, pg_core_1.text)("name").notNull(),
    query: (0, pg_core_1.text)("query").notNull(), // Stored expert query for TED API
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
//# sourceMappingURL=schema.js.map