import { Router, type IRouter } from "express";
import { useMockDb, PrescriptionModel, UserModel } from "../db";
import { inMemoryPrescriptions, inMemoryUsers } from "../db/mockData";
import { requireAdminAuth, ADMIN_TOKEN } from "../middlewares/auth";
import {
  ListPrescriptionsResponse,
  UploadPrescriptionBody,
  UploadPrescriptionResponse,
  VerifyPrescriptionParams,
  VerifyPrescriptionBody,
  VerifyPrescriptionResponse,
} from "../api-zod";

const router: IRouter = Router();



function formatMongoPrescription(p: any) {
  const obj = p.toObject ? p.toObject() : p;
  return {
    id: obj.id,
    customerName: obj.customerName,
    fileUrl: obj.fileUrl,
    notes: obj.notes,
    status: obj.status,
    createdAt: obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt,
  };
}

router.get("/prescriptions", async (req, res): Promise<void> => {
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

  let customerName: string | null = null;
  if (isCustomer) {
    const customerId = parseInt(authHeader.replace("Bearer customer_token_", ""), 10);
    if (useMockDb) {
      const user = inMemoryUsers.find(u => u.id === customerId);
      if (user) {
        customerName = user.name;
      } else {
        res.status(401).json({ error: "User not found" });
        return;
      }
    } else {
      const user = await UserModel.findOne({ id: customerId });
      if (user) {
        customerName = user.name;
      } else {
        res.status(401).json({ error: "User not found" });
        return;
      }
    }
  }

  if (useMockDb) {
    let list = [...inMemoryPrescriptions];
    if (customerName) {
      list = list.filter(p => p.customerName.toLowerCase() === customerName!.toLowerCase());
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(ListPrescriptionsResponse.parse(list));
    return;
  }

  const filter = customerName ? { customerName: { $regex: new RegExp(`^${customerName}$`, "i") } } : {};
  const prescriptions = await PrescriptionModel.find(filter).sort({ createdAt: -1 });
  res.json(ListPrescriptionsResponse.parse(prescriptions.map(formatMongoPrescription)));
});

router.post("/prescriptions", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer customer_token_")) {
    res.status(401).json({ error: "Unauthorized: Please login to upload prescriptions" });
    return;
  }

  const parsed = UploadPrescriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (useMockDb) {
    const newRx = {
      id: inMemoryPrescriptions.length > 0 ? Math.max(...inMemoryPrescriptions.map(p => p.id)) + 1 : 501,
      customerName: parsed.data.customerName,
      fileUrl: parsed.data.fileUrl,
      notes: parsed.data.notes ?? "",
      status: "Pending Review",
      createdAt: new Date().toISOString()
    };
    inMemoryPrescriptions.push(newRx);
    res.status(201).json(UploadPrescriptionResponse.parse(newRx));
    return;
  }

  const maxDoc = await PrescriptionModel.findOne().sort({ id: -1 });
  const nextId = maxDoc && maxDoc.id ? maxDoc.id + 1 : 501;

  const newRx = await PrescriptionModel.create({
    id: nextId,
    customerName: parsed.data.customerName,
    fileUrl: parsed.data.fileUrl,
    notes: parsed.data.notes ?? "",
    status: "Pending Review",
  });

  res.status(201).json(UploadPrescriptionResponse.parse(formatMongoPrescription(newRx)));
});

router.patch("/prescriptions/:id/verify", requireAdminAuth, async (req, res): Promise<void> => {
  const params = VerifyPrescriptionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = VerifyPrescriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (useMockDb) {
    const idx = inMemoryPrescriptions.findIndex(p => p.id === params.data.id);
    if (idx === -1) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }
    inMemoryPrescriptions[idx].status = parsed.data.status;
    if (parsed.data.notes) {
      inMemoryPrescriptions[idx].notes = parsed.data.notes;
    }
    res.json(VerifyPrescriptionResponse.parse(inMemoryPrescriptions[idx]));
    return;
  }

  const updateFields: any = { status: parsed.data.status };
  if (parsed.data.notes) {
    updateFields.notes = parsed.data.notes;
  }

  const prescription = await PrescriptionModel.findOneAndUpdate(
    { id: params.data.id },
    { $set: updateFields },
    { new: true }
  );

  if (!prescription) {
    res.status(404).json({ error: "Prescription not found" });
    return;
  }

  res.json(VerifyPrescriptionResponse.parse(formatMongoPrescription(prescription)));
});

export default router;
