import { pgTable, serial, text, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  ownerAddress: text("owner_address").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  endpoint: text("endpoint").notNull(),
  price: numeric("price", { precision: 30, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  stakeRequired: numeric("stake_required", { precision: 30, scale: 8 }).notNull().default("0"),
  successRate: integer("success_rate").notNull().default(10000),
  avgLatency: integer("avg_latency").notNull().default(0),
  totalCalls: integer("total_calls").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true, createdAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
