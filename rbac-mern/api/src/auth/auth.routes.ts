import { Router } from "express";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../validation/auth.validation";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

const router = Router();

/**
 * @route POST /auth/register
 * @desc Register a new user (Admin, Editor, or Viewer)
 */
router.post("/register", validate(registerSchema), async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, password: hashed, role: role || "Viewer" });

    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 */
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
