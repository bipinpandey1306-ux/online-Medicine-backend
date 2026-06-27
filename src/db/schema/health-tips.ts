import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const healthTipsTable = pgTable("health_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  author: text("author").notNull().default("Krishna Pharmacy Team"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHealthTipSchema = createInsertSchema(healthTipsTable).omit({ id: true, createdAt: true });
export type InsertHealthTip = z.infer<typeof insertHealthTipSchema>;
export type HealthTip = typeof healthTipsTable.$inferSelect;
