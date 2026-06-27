import { Router, type IRouter } from "express";
import crypto from "crypto";
import { inMemoryUsers } from "../db/mockData";
import { useMockDb, UserModel } from "../db";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }

    let existingUser;
    if (useMockDb) {
      existingUser = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    }

    if (existingUser) {
      res.status(400).json({ error: "Email is already registered" });
      return;
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    let newUser;

    if (useMockDb) {
      newUser = {
        id: inMemoryUsers.length > 0 ? Math.max(...inMemoryUsers.map(u => u.id)) + 1 : 1,
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone ?? "",
        address: address ?? "",
        gender: "Male",
        profileCompletion: 83
      };
      inMemoryUsers.push(newUser);
    } else {
      const maxDoc = await UserModel.findOne().sort({ id: -1 }).select("id").exec();
      const nextId = maxDoc && typeof maxDoc.id === "number" ? maxDoc.id + 1 : 1;
      newUser = await UserModel.create({
        id: nextId,
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone ?? "",
        address: address ?? "",
        gender: "Male",
        profileCompletion: 83
      });
    }

    const { passwordHash: _, ...userSafe } = JSON.parse(JSON.stringify(newUser));
    const token = `customer_token_${newUser.id}`;

    res.status(201).json({ success: true, token, user: userSafe });
  } catch (error: any) {
    console.error("[REGISTER ERROR] Failed to register user:", error);
    res.status(500).json({ error: error.message || "Registration failed. Please try again." });
  }
});

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    let user;
    if (useMockDb) {
      user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      user = await UserModel.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    if (user.passwordHash !== passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { passwordHash: _, ...userSafe } = JSON.parse(JSON.stringify(user));
    const token = `customer_token_${user.id}`;

    res.json({ success: true, token, user: userSafe });
  } catch (error: any) {
    console.error("[LOGIN ERROR] Failed to login user:", error);
    res.status(500).json({ error: error.message || "Login failed. Please try again." });
  }
});

router.patch("/auth/profile", async (req, res): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer customer_token_")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const customerId = parseInt(authHeader.replace("Bearer customer_token_", ""), 10);
    const { name, phone, email, gender, address } = req.body;

    let updatedUser;
    if (useMockDb) {
      const userIdx = inMemoryUsers.findIndex(u => u.id === customerId);
      if (userIdx === -1) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      if (name !== undefined) inMemoryUsers[userIdx].name = name;
      if (phone !== undefined) inMemoryUsers[userIdx].phone = phone;
      if (email !== undefined) inMemoryUsers[userIdx].email = email;
      if (gender !== undefined) inMemoryUsers[userIdx].gender = gender;
      if (address !== undefined) inMemoryUsers[userIdx].address = address;
      updatedUser = inMemoryUsers[userIdx];
    } else {
      const updateFields: any = {};
      if (name !== undefined) updateFields.name = name;
      if (phone !== undefined) updateFields.phone = phone;
      if (email !== undefined) updateFields.email = email;
      if (gender !== undefined) updateFields.gender = gender;
      if (address !== undefined) updateFields.address = address;

      updatedUser = await UserModel.findOneAndUpdate(
        { id: customerId },
        { $set: updateFields },
        { new: true }
      );
      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }
    }

    const { passwordHash: _, ...userSafe } = JSON.parse(JSON.stringify(updatedUser));
    res.json({ success: true, user: userSafe });
  } catch (error: any) {
    console.error("[PROFILE UPDATE ERROR] Failed to update user profile:", error);
    res.status(500).json({ error: error.message || "Failed to update profile. Please try again." });
  }
});

export default router;
