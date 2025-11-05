import jwt from "jsonwebtoken";
import { permissionsForRole, RoleValue } from "../config/roles";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TTL_MIN = parseInt(process.env.ACCESS_TTL_MIN || "15", 10);
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || "7", 10);
const JWT_SECRET = process.env.JWT_SECRET!;
export const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME || "refresh_token";

export interface AccessTokenPayload {
  sub: string; // userId
  role: RoleValue;
  perms: string[];
}

export function signAccessToken(userId: string, role: RoleValue) {
  const perms = permissionsForRole(role);
  const payload: AccessTokenPayload = { sub: userId, role, perms };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${ACCESS_TTL_MIN}m` });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
}

export interface RefreshTokenPayload {
  sub: string;
  role: RoleValue;
  typ: "refresh";
}

export function signRefreshToken(userId: string, role: RoleValue) {
  const payload: RefreshTokenPayload = { sub: userId, role, typ: "refresh" };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${REFRESH_TTL_DAYS}d` });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
  if (decoded.typ !== "refresh") throw new Error("Invalid token type");
  return decoded;
}
