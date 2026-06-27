import { Request, Response, NextFunction } from "express";

export const ADMIN_TOKEN = "admin_secure_session_token_123456";

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized: Admin access required" });
  }
}
