import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { can } from "../../middleware/authorize";
import { UserModel } from "../../models/user.model";
import { Role } from "../../config/roles";

const router = Router();

// List users (email, role, id) — Admin only
router.get("/", authenticate, can("users:manage"), async (_req, res) => {
  const users = await UserModel.find({}, { email: 1, role: 1 }).sort({ createdAt: -1 });
  res.json(users.map(u => ({ id: u._id, email: u.email, role: u.role })));
});

// Update a user's role — Admin only
router.patch("/:id/role", authenticate, can("users:manage"), async (req, res) => {
  const { role } = req.body ?? {};
  if (!role || !Object.values(Role).includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const updated = await UserModel.findByIdAndUpdate(
    req.params.id,
    { $set: { role } },
    { new: true, projection: { email: 1, role: 1 } }
  );
  if (!updated) return res.status(404).json({ error: "User not found" });
  res.json({ id: updated._id, email: updated.email, role: updated.role });
});

export default router;
