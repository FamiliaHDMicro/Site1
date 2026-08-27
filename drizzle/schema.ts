import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const siteoneTestCheckouts = mysqlTable("siteone_test_checkouts", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 80 }).notNull().unique(),
  businessName: varchar("businessName", { length: 80 }).notNull(),
  planCode: varchar("planCode", { length: 48 }).notNull(),
  menuItemCount: int("menuItemCount").notNull(),
  amountCents: int("amountCents").notNull(),
  status: mysqlEnum("status", ["created", "pending", "approved", "rejected", "cancelled", "error"]).default("created").notNull(),
  mercadoPagoPreferenceId: varchar("mercadoPagoPreferenceId", { length: 120 }),
  mercadoPagoPaymentId: varchar("mercadoPagoPaymentId", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SiteoneTestCheckout = typeof siteoneTestCheckouts.$inferSelect;
export type SiteoneTestCheckoutStatus = "created" | "pending" | "approved" | "rejected" | "cancelled" | "error";
