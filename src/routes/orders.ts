import { Router, type IRouter } from "express";
import { useMockDb, OrderModel, UserModel, MedicineModel } from "../db";
import { mockMedicines, inMemoryOrders, inMemoryUsers } from "../db/mockData";
import { requireAdminAuth, ADMIN_TOKEN } from "../middlewares/auth";
import {
  ListOrdersResponse,
  CreateOrderBody,
  CreateOrderResponse,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
} from "../api-zod";

const router: IRouter = Router();



function formatMongoOrder(o: any) {
  const obj = o.toObject ? o.toObject() : o;
  return {
    id: obj.id,
    customerName: obj.customerName,
    customerPhone: obj.customerPhone,
    deliveryAddress: obj.deliveryAddress,
    status: obj.status,
    totalAmount: Number(obj.totalAmount),
    prescriptionId: obj.prescriptionId,
    paymentStatus: obj.paymentStatus,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
    items: Array.isArray(obj.items) ? obj.items.map((it: any) => ({
      medicineId: it.medicineId,
      medicineName: it.medicineName,
      price: Number(it.price),
      quantity: it.quantity
    })) : [],
  };
}

router.get("/orders", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const isAdmin = authHeader === `Bearer ${ADMIN_TOKEN}`;
  const isCustomer = authHeader.startsWith("Bearer customer_token_");

  if (!isAdmin && !isCustomer) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  let customerPhone: string | null = null;
  if (isCustomer) {
    const customerId = parseInt(authHeader.replace("Bearer customer_token_", ""), 10);
    if (useMockDb) {
      const user = inMemoryUsers.find(u => u.id === customerId);
      if (user) {
        customerPhone = user.phone;
      } else {
        res.status(401).json({ error: "User not found" });
        return;
      }
    } else {
      const user = await UserModel.findOne({ id: customerId });
      if (user) {
        customerPhone = user.phone;
      } else {
        res.status(401).json({ error: "User not found" });
        return;
      }
    }
  }

  if (useMockDb) {
    let list = [...inMemoryOrders];
    if (customerPhone) {
      list = list.filter(o => o.customerPhone === customerPhone);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(ListOrdersResponse.parse(list));
    return;
  }

  const filter = customerPhone ? { customerPhone } : {};
  const orders = await OrderModel.find(filter).sort({ createdAt: -1 });
  res.json(ListOrdersResponse.parse(orders.map(formatMongoOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer customer_token_")) {
    res.status(401).json({ error: "Unauthorized: Please login to place an order" });
    return;
  }

  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const totalAmount = parsed.data.items.reduce(
    (sum: number, item: { medicineId: number; quantity: number }) => {
      const med = mockMedicines.find(m => m.id === item.medicineId);
      return sum + (med ? med.discountPrice : 0) * item.quantity;
    },
    0
  );

  if (useMockDb) {
    const items = parsed.data.items.map(item => {
      const med = mockMedicines.find(m => m.id === item.medicineId);
      return {
        medicineId: item.medicineId,
        medicineName: med ? med.name : `Medicine #${item.medicineId}`,
        price: med ? med.discountPrice : 0,
        quantity: item.quantity
      };
    });

    const newOrder = {
      id: inMemoryOrders.length > 0 ? Math.max(...inMemoryOrders.map(o => o.id)) + 1 : 1001,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      deliveryAddress: parsed.data.deliveryAddress,
      items,
      totalAmount,
      status: "Placed",
      createdAt: new Date().toISOString()
    };
    inMemoryOrders.push(newOrder);
    res.status(201).json(CreateOrderResponse.parse(newOrder));
    return;
  }

  // Load medicines from MongoDB
  const medicineIds = parsed.data.items.map(it => it.medicineId);
  const meds = await MedicineModel.find({ id: { $in: medicineIds } });
  
  const items = parsed.data.items.map(item => {
    const med = meds.find(m => m.id === item.medicineId);
    return {
      medicineId: item.medicineId,
      medicineName: med ? med.name : `Medicine #${item.medicineId}`,
      price: med ? med.discountPrice : 0,
      quantity: item.quantity
    };
  });

  const mongoTotalAmount = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const maxDoc = await OrderModel.findOne().sort({ id: -1 });
  const nextId = maxDoc && maxDoc.id ? maxDoc.id + 1 : 1001;

  const newOrder = await OrderModel.create({
    id: nextId,
    customerName: parsed.data.customerName,
    customerPhone: parsed.data.customerPhone,
    deliveryAddress: parsed.data.deliveryAddress,
    prescriptionId: parsed.data.prescriptionId,
    totalAmount: mongoTotalAmount,
    status: "Placed",
    paymentStatus: "pending",
    items,
  });

  res.status(201).json(CreateOrderResponse.parse(formatMongoOrder(newOrder)));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (useMockDb) {
    const order = inMemoryOrders.find(o => o.id === params.data.id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(GetOrderResponse.parse(order));
    return;
  }

  const order = await OrderModel.findOne({ id: params.data.id });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(formatMongoOrder(order)));
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const params = UpdateOrderStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (useMockDb) {
    const idx = inMemoryOrders.findIndex(o => o.id === params.data.id);
    if (idx === -1) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    inMemoryOrders[idx].status = parsed.data.status;
    res.json(UpdateOrderStatusResponse.parse(inMemoryOrders[idx]));
    return;
  }

  const order = await OrderModel.findOneAndUpdate(
    { id: params.data.id },
    { $set: { status: parsed.data.status } },
    { new: true }
  );

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(UpdateOrderStatusResponse.parse(formatMongoOrder(order)));
});

export default router;
