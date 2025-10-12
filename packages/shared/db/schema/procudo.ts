import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Core application schema for the procudo database.
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
