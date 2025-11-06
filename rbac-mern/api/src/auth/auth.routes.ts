import { Router } from "express";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validation/auth.validation";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, REFRESH_COOKIE_NAME } from "./jwt"; // if using refresh
const router = Router();

router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password, role } = req.body;
  const exists = await UserModel.findOne({ email });
  if (exists) return res.status(400).json({ error: "User already exists" });
  const passwordHash = await bcrypt.hash(password, 10);         // <-- hash to passwordHash
  const user = await UserModel.create({ email, passwordHash, role: role || "Viewer" });
  return res.status(201).json({ id: user._id, email: user.email, role: user.role });
});

router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid email or password" });

  const ok = await user.comparePassword(password);              // <-- use method
  if (!ok) return res.status(401).json({ error: "Invalid email or password" });

  const accessToken = signAccessToken(user.id, user.role);
  // (optional) also set refresh cookie if you implemented refresh:
  // const refreshToken = signRefreshToken(user.id, user.role);
  // res.cookie(REFRESH_COOKIE_NAME, refreshToken, { httpOnly: true, sameSite: "lax", secure: false, path: "/auth" });

  return res.json({ accessToken });
});

export default router;
