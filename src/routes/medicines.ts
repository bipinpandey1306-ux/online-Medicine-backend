import { Router, type IRouter } from "express";
import { useMockDb, MedicineModel } from "../db";
import { mockMedicines } from "../db/mockData";
import {
  ListMedicinesQueryParams,
  ListMedicinesResponse,
  CreateMedicineBody,
  CreateMedicineResponse,
  GetMedicineParams,
  GetMedicineResponse,
  UpdateMedicineParams,
  UpdateMedicineBody,
  UpdateMedicineResponse,
  DeleteMedicineParams,
  GetFeaturedMedicinesResponse,
} from "../api-zod";

const router: IRouter = Router();

router.get("/medicines/featured", async (_req, res): Promise<void> => {
  try {
    if (useMockDb) {
      const featured = mockMedicines.filter(m => m.isFeatured);
      res.json(GetFeaturedMedicinesResponse.parse(featured));
      return;
    }

    const medicines = await MedicineModel.find({ isFeatured: true }).limit(8);
    res.json(GetFeaturedMedicinesResponse.parse(medicines.map(formatMedicine)));
  } catch (error: any) {
    console.error("[FEATURED MEDICINES ERROR] Failed to fetch featured medicines:", error);
    res.status(500).json({ error: error.message || "Failed to fetch featured medicines" });
  }
});

router.get("/medicines", async (req, res): Promise<void> => {
  try {
    const params = ListMedicinesQueryParams.safeParse(req.query);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    if (useMockDb) {
      let list = [...mockMedicines];
      if (params.data.search) {
        const s = params.data.search.toLowerCase();
        list = list.filter(m => 
          (m.name && m.name.toLowerCase().includes(s)) || 
          (m.saltComposition && m.saltComposition.toLowerCase().includes(s)) || 
          (m.brand && m.brand.toLowerCase().includes(s)) || 
          (m.category && m.category.toLowerCase().includes(s))
        );
      }
      if (params.data.category) {
        const c = params.data.category.toLowerCase();
        list = list.filter(m => m.category && m.category.toLowerCase() === c);
      }
      if (params.data.featured !== undefined) {
        list = list.filter(m => m.isFeatured === params.data.featured);
      }
      const limit = params.data.limit ?? 20;
      const offset = params.data.offset ?? 0;
      const rows = list.slice(offset, offset + limit);
      res.json(ListMedicinesResponse.parse(rows));
      return;
    }

    const conditions: any = {};
    if (params.data.search) {
      const s = new RegExp(params.data.search, "i");
      conditions.$or = [
        { name: s },
        { saltComposition: s },
        { brand: s },
        { category: s }
      ];
    }
    if (params.data.category) {
      conditions.category = new RegExp(`^${params.data.category}$`, "i");
    }
    if (params.data.featured !== undefined) {
      conditions.isFeatured = params.data.featured;
    }

    const limit = params.data.limit ?? 20;
    const offset = params.data.offset ?? 0;

    const rows = await MedicineModel.find(conditions).skip(offset).limit(limit);
    res.json(ListMedicinesResponse.parse(rows.map(formatMedicine)));
  } catch (error: any) {
    console.error("[MEDICINES ERROR] Failed to fetch medicines:", error);
    res.status(500).json({ error: error.message || "Failed to fetch medicines" });
  }
});

router.post("/medicines", async (req, res): Promise<void> => {
  const parsed = CreateMedicineBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (useMockDb) {
    const newMed = {
      id: mockMedicines.length > 0 ? Math.max(...mockMedicines.map(m => m.id)) + 1 : 1,
      ...parsed.data,
      stock: parsed.data.stock ?? 100,
      isFeatured: parsed.data.isFeatured ?? false,
      createdAt: new Date().toISOString()
    };
    mockMedicines.push(newMed as any);
    res.status(201).json(CreateMedicineResponse.parse(newMed));
    return;
  }

  const maxDoc = await MedicineModel.findOne().sort({ id: -1 });
  const nextId = maxDoc && maxDoc.id ? maxDoc.id + 1 : 1;

  const medicine = await MedicineModel.create({
    id: nextId,
    ...parsed.data,
    mrp: parsed.data.mrp,
    discountPrice: parsed.data.discountPrice
  });

  res.status(201).json(CreateMedicineResponse.parse(formatMedicine(medicine)));
});

router.get("/medicines/:id", async (req, res): Promise<void> => {
  const params = GetMedicineParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (useMockDb) {
    const medicine = mockMedicines.find(m => m.id === params.data.id);
    if (!medicine) {
      res.status(404).json({ error: "Medicine not found" });
      return;
    }
    res.json(GetMedicineResponse.parse(medicine));
    return;
  }

  const medicine = await MedicineModel.findOne({ id: params.data.id });
  if (!medicine) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }

  res.json(GetMedicineResponse.parse(formatMedicine(medicine)));
});

router.patch("/medicines/:id", async (req, res): Promise<void> => {
  const params = UpdateMedicineParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateMedicineBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (useMockDb) {
    const idx = mockMedicines.findIndex(m => m.id === params.data.id);
    if (idx === -1) {
      res.status(404).json({ error: "Medicine not found" });
      return;
    }
    mockMedicines[idx] = {
      ...mockMedicines[idx],
      ...parsed.data
    };
    res.json(UpdateMedicineResponse.parse(mockMedicines[idx]));
    return;
  }

  const medicine = await MedicineModel.findOneAndUpdate(
    { id: params.data.id },
    { $set: parsed.data },
    { new: true }
  );

  if (!medicine) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }

  res.json(UpdateMedicineResponse.parse(formatMedicine(medicine)));
});

router.delete("/medicines/:id", async (req, res): Promise<void> => {
  const params = DeleteMedicineParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (useMockDb) {
    const idx = mockMedicines.findIndex(m => m.id === params.data.id);
    if (idx === -1) {
      res.status(404).json({ error: "Medicine not found" });
      return;
    }
    mockMedicines.splice(idx, 1);
    res.sendStatus(204);
    return;
  }

  const medicine = await MedicineModel.findOneAndDelete({ id: params.data.id });
  if (!medicine) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }

  res.sendStatus(204);
});

function formatMedicine(m: any) {
  return {
    id: m.id,
    name: m.name,
    brand: m.brand,
    saltComposition: m.saltComposition || "",
    category: m.category,
    description: m.description || "",
    dosage: m.dosage || "",
    sideEffects: m.sideEffects || "",
    storageInstructions: m.storageInstructions || "",
    manufacturer: m.manufacturer || "",
    batchNumber: m.batchNumber || "",
    expiryDate: m.expiryDate || "",
    mrp: Number(m.mrp),
    discountPrice: Number(m.discountPrice),
    stock: m.stock,
    prescriptionRequired: m.prescriptionRequired,
    imageUrl: m.imageUrl || "",
    isFeatured: m.isFeatured,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : new Date(m.createdAt).toISOString()
  };
}

export default router;
