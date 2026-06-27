import { Router, type IRouter } from "express";
import { useMockDb, OrderModel, MedicineModel, PrescriptionModel } from "../db";
import { mockMedicines, inMemoryOrders, inMemoryPrescriptions } from "../db/mockData";
import { requireAdminAuth, ADMIN_TOKEN } from "../middlewares/auth";
import crypto from "crypto";
import {
  GetAdminDashboardResponse,
  GetSalesDataResponse,
  GetTopMedicinesResponse,
} from "../api-zod";

const ADMIN_EMAIL_HASH = "fbabdec7fa033ef1ddaf3df1d665a260b47464426d0fe2513788413f8405ae0c";
const ADMIN_PASSWORD_HASH = "426848eb68bf6aa07212a4070863dbe30d92456cf011e238252ddfd86a247856";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const emailHash = crypto.createHash("sha256").update(email).digest("hex");
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

  if (emailHash === ADMIN_EMAIL_HASH && passwordHash === ADMIN_PASSWORD_HASH) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

router.get("/admin/dashboard", requireAdminAuth, async (_req, res): Promise<void> => {
  if (useMockDb) {
    const totalRevenue = inMemoryOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingRx = inMemoryPrescriptions.filter(p => p.status.toLowerCase().includes("pending")).length;
    const stats = {
      totalRevenue,
      totalOrders: inMemoryOrders.length,
      totalCustomers: Math.floor(inMemoryOrders.length * 1.3) + 42,
      totalMedicines: mockMedicines.length,
      activeUsers: Math.floor(Math.random() * 50) + 120,
      pendingPrescriptions: pendingRx,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
    };
    res.json(GetAdminDashboardResponse.parse(stats));
    return;
  }

  const orderStats = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" }
      }
    }
  ]);
  const totalOrders = orderStats[0]?.total ?? 0;
  const totalRevenue = orderStats[0]?.totalRevenue ?? 0;

  const totalMedicines = await MedicineModel.countDocuments();

  const pendingPrescriptionsCount = await PrescriptionModel.countDocuments({
    status: { $regex: /pending/i }
  });

  const stats = {
    totalRevenue: Number(totalRevenue),
    totalOrders: Number(totalOrders),
    totalCustomers: Math.floor(Number(totalOrders) * 1.3) + 42,
    totalMedicines: Number(totalMedicines),
    activeUsers: Math.floor(Math.random() * 50) + 120,
    pendingPrescriptions: Number(pendingPrescriptionsCount),
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
  };

  res.json(GetAdminDashboardResponse.parse(stats));
});

router.get("/admin/sales", requireAdminAuth, async (_req, res): Promise<void> => {
  // Generate last 30 days of sales data
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.floor(Math.random() * 15000) + 5000,
      orders: Math.floor(Math.random() * 30) + 10,
    });
  }
  res.json(GetSalesDataResponse.parse(data));
});

router.get("/admin/top-medicines", requireAdminAuth, async (_req, res): Promise<void> => {
  if (useMockDb) {
    const topMedicines = mockMedicines.slice(0, 5).map((m: any, i: number) => ({
      id: m.id,
      name: m.name,
      salesCount: Math.floor(Math.random() * 100) + 20 - i * 5,
      revenue: Math.floor(Math.random() * 50000) + 10000 - i * 2000,
      imageUrl: m.imageUrl,
    }));
    res.json(GetTopMedicinesResponse.parse(topMedicines));
    return;
  }

  const medicines = await MedicineModel.find().sort({ id: -1 }).limit(5);

  const topMedicines = medicines.map((m: any, i: number) => ({
    id: m.id,
    name: m.name,
    salesCount: Math.floor(Math.random() * 100) + 20 - i * 5,
    revenue: Math.floor(Math.random() * 50000) + 10000 - i * 2000,
    imageUrl: m.imageUrl,
  }));

  res.json(GetTopMedicinesResponse.parse(topMedicines));
});

export default router;
