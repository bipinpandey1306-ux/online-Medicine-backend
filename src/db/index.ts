import mongoose from "mongoose";
import { mockMedicines, inMemoryUsers, mockCategories, mockHealthTips, inMemoryOrders, inMemoryPrescriptions } from "./mockData";

const dbUrl = process.env.DATABASE_URL || "";
export const isMongo = dbUrl.startsWith("mongodb://") || dbUrl.startsWith("mongodb+srv://");
export const useMockDb = !isMongo;

// 1. Schemas Definition
const MedicineSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  saltComposition: { type: String, default: "" },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  dosage: { type: String, default: "" },
  sideEffects: { type: String, default: "" },
  storageInstructions: { type: String, default: "" },
  manufacturer: { type: String, default: "" },
  batchNumber: { type: String, default: "" },
  expiryDate: { type: String, default: "" },
  mrp: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  prescriptionRequired: { type: Boolean, default: false },
  imageUrl: { type: String, default: "" },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  gender: { type: String, default: "Male" },
  profileCompletion: { type: Number, default: 83 }
});

const OrderItemSchema = new mongoose.Schema({
  medicineId: { type: Number, required: true },
  medicineName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Placed" },
  prescriptionId: { type: Number },
  paymentStatus: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const PrescriptionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  customerName: { type: String, required: true },
  notes: { type: String, default: "" },
  fileUrl: { type: String, required: true },
  status: { type: String, default: "Pending Review" },
  createdAt: { type: Date, default: Date.now }
});

const CategorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: "pill" },
  medicineCount: { type: Number, default: 0 }
});

const HealthTipSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, default: "" },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: { type: String, default: "Krishna Pharmacy Team" },
  createdAt: { type: Date, default: Date.now }
});

// 2. Models
export const MedicineModel = mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);
export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
export const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export const PrescriptionModel = mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
export const CategoryModel = mongoose.models.Category || mongoose.model("Category", CategorySchema);
export const HealthTipModel = mongoose.models.HealthTip || mongoose.model("HealthTip", HealthTipSchema);

// 3. Database Seeding Function
async function seedDatabase() {
  try {
    // Sync medicines (upsert each to make sure additions are added)
    for (const med of mockMedicines) {
      await MedicineModel.findOneAndUpdate({ id: med.id }, { $set: med }, { upsert: true, new: true });
    }
    console.log("[MONGO DB] Synchronized mock medicines catalog.");
    
    // Sync categories
    for (const cat of mockCategories) {
      await CategoryModel.findOneAndUpdate({ id: cat.id }, { $set: cat }, { upsert: true, new: true });
    }
    console.log("[MONGO DB] Synchronized categories catalog.");
    
    // Sync default users
    for (const user of inMemoryUsers) {
      await UserModel.findOneAndUpdate({ id: user.id }, { $set: user }, { upsert: true, new: true });
    }
    console.log("[MONGO DB] Synchronized default users.");

    // Sync health tips
    for (const tip of mockHealthTips) {
      await HealthTipModel.findOneAndUpdate({ id: tip.id }, { $set: tip }, { upsert: true, new: true });
    }
    console.log("[MONGO DB] Synchronized health tips catalog.");

    const orderCount = await OrderModel.countDocuments();
    if (orderCount === 0) {
      await OrderModel.insertMany(inMemoryOrders.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt)
      })));
      console.log("[MONGO DB] Seeded mock orders.");
    }

    const rxCount = await PrescriptionModel.countDocuments();
    if (rxCount === 0) {
      await PrescriptionModel.insertMany(inMemoryPrescriptions.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt)
      })));
      console.log("[MONGO DB] Seeded mock prescriptions.");
    }
  } catch (err) {
    console.error("[MONGO DB] Database seeding failed:", err);
  }
}

// 4. Mongoose Connection
if (isMongo) {
  mongoose.connect(dbUrl)
    .then(() => {
      console.log("[MONGO DB] Connected to MongoDB Atlas successfully.");
      seedDatabase();
    })
    .catch(err => {
      console.error("[MONGO DB] Failed to connect to MongoDB Atlas:", err);
    });
} else {
  console.warn("[WARNING] DATABASE_URL is not a MongoDB connection string. Falling back to in-memory database!");
}
