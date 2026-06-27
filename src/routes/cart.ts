import { Router, type IRouter } from "express";
import { useMockDb, MedicineModel } from "../db";
import { mockMedicines } from "../db/mockData";
import {
  AddToCartBody,
  AddToCartResponse,
  RemoveFromCartParams,
  RemoveFromCartResponse,
  GetCartResponse,
} from "../api-zod";

const router: IRouter = Router();

// In-memory cart for demo (keyed by session; simplified for this build)
const cartStore: Map<string, CartItem[]> = new Map();

interface CartItem {
  medicineId: number;
  medicineName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  prescriptionRequired: boolean;
}

function getSessionId(req: any): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer customer_token_")) {
    return authHeader.replace("Bearer ", "");
  }
  return req.ip ?? "default";
}

function buildCartResponse(items: CartItem[]) {
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return {
    items,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}

router.get("/cart", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  const items = cartStore.get(sessionId) ?? [];
  res.json(GetCartResponse.parse(buildCartResponse(items)));
});

router.post("/cart", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let medicine: any = null;
  if (useMockDb) {
    medicine = mockMedicines.find(m => m.id === parsed.data.medicineId);
  } else {
    medicine = await MedicineModel.findOne({ id: parsed.data.medicineId });
  }

  if (!medicine) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }

  const sessionId = getSessionId(req);
  const items = cartStore.get(sessionId) ?? [];
  const existingIdx = items.findIndex((i) => i.medicineId === parsed.data.medicineId);

  if (existingIdx >= 0) {
    items[existingIdx].quantity += parsed.data.quantity;
  } else {
    items.push({
      medicineId: medicine.id,
      medicineName: medicine.name,
      quantity: parsed.data.quantity,
      price: Number(medicine.discountPrice),
      imageUrl: medicine.imageUrl,
      prescriptionRequired: medicine.prescriptionRequired,
    });
  }

  cartStore.set(sessionId, items);
  res.json(AddToCartResponse.parse(buildCartResponse(items)));
});

router.delete("/cart/:medicineId", async (req, res): Promise<void> => {
  const params = RemoveFromCartParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const sessionId = getSessionId(req);
  const items = cartStore.get(sessionId) ?? [];
  const filtered = items.filter((i) => i.medicineId !== params.data.medicineId);
  cartStore.set(sessionId, filtered);

  res.json(RemoveFromCartResponse.parse(buildCartResponse(filtered)));
});

export default router;
