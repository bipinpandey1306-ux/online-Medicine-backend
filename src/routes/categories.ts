import { Router, type IRouter } from "express";
import { useMockDb, CategoryModel, MedicineModel } from "../db";
import { mockCategories, mockMedicines } from "../db/mockData";
import { ListCategoriesResponse } from "../api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  try {
    if (useMockDb) {
      const categoriesWithCounts = mockCategories.map(cat => ({
        ...cat,
        medicineCount: mockMedicines.filter(m => m.category && cat.name && m.category.toLowerCase() === cat.name.toLowerCase()).length
      }));
      res.json(ListCategoriesResponse.parse(categoriesWithCounts));
      return;
    }

    const categories = await CategoryModel.find();
    const medicines = await MedicineModel.find();
    const categoriesWithCounts = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      medicineCount: medicines.filter(m => m.category && cat.name && m.category.toLowerCase() === cat.name.toLowerCase()).length
    }));

    res.json(ListCategoriesResponse.parse(categoriesWithCounts));
  } catch (error: any) {
    console.error("[CATEGORIES ERROR] Failed to fetch categories:", error);
    res.status(500).json({ error: error.message || "Failed to fetch categories" });
  }
});

export default router;
