import { pgTable, serial, text, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const receiptsTable = pgTable("receipts", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  payer: text("payer").notNull(),
  provider: text("provider").notNull(),
  token: text("token").notNull(),
  amount: numeric("amount", { precision: 30, scale: 8 }).notNull(),
  txHash: text("tx_hash"),
  requestHash: text("request_hash"),
  responseHash: text("response_hash"),
  success: boolean("success").notNull().default(true),
  latencyMs: integer("latency_ms").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReceiptSchema = createInsertSchema(receiptsTable).omit({ id: true, createdAt: true });
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receiptsTable.$inferSelect;
