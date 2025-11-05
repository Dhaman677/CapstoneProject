import { Router } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { signAccessToken, signRefreshToken, verifyRefreshToken, REFRESH_COOKIE_NAME } from "./jwt";

const router = Router();

const isProd = process.env.NODE_ENV === "production";

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  const user = await UserModel.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * (parseInt(process.env.REFRESH_TTL_DAYS || "7", 10)),
    path: "/auth",
  });

  return res.json({ accessToken });
});

router.post("/refresh", async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken(payload.sub, payload.role);
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/auth" });
  res.status(204).end();
});

export default router;
