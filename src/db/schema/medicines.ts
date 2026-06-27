import { pgTable, serial, text, boolean, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const medicinesTable = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  saltComposition: text("salt_composition"),
  category: text("category").notNull(),
  description: text("description"),
  dosage: text("dosage"),
  sideEffects: text("side_effects"),
  storageInstructions: text("storage_instructions"),
  manufacturer: text("manufacturer"),
  batchNumber: text("batch_number"),
  expiryDate: text("expiry_date"),
  mrp: numeric("mrp", { precision: 10, scale: 2 }).notNull(),
  discountPrice: numeric("discount_price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  prescriptionRequired: boolean("prescription_required").notNull().default(false),
  imageUrl: text("image_url").notNull().default(""),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMedicineSchema = createInsertSchema(medicinesTable).omit({ id: true, createdAt: true });
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicinesTable.$inferSelect;
