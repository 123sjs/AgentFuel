import { pgTable, serial, text, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const providersTable = pgTable("providers", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  stakedFuel: numeric("staked_fuel", { precision: 30, scale: 8 }).notNull().default("0"),
  reputationScore: integer("reputation_score").notNull().default(0),
  slashCount: integer("slash_count").notNull().default(0),
  totalEarnings: numeric("total_earnings", { precision: 30, scale: 8 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProviderSchema = createInsertSchema(providersTable).omit({ id: true, createdAt: true });
export type InsertProvider = z.infer<typeof insertProviderSchema>;
export type Provider = typeof providersTable.$inferSelect;
