import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../auth/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, perms: payload.perms };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
