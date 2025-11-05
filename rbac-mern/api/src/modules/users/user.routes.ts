import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { can } from "../../middleware/authorize";
import { UserModel } from "../../models/user.model";
import { Role } from "../../config/roles";
import { AuditModel } from "../../models/audit.model";


const router = Router();

// List users (email, role, id) — Admin only
router.get("/", authenticate, can("users:manage"), async (_req, res) => {
  const users = await UserModel.find({}, { email: 1, role: 1 }).sort({ createdAt: -1 });
  res.json(users.map(u => ({ id: u._id, email: u.email, role: u.role })));
});

router.patch("/:id/role", authenticate, can("users:manage"), async (req, res) => {
  console.log("PATCH /admin/users/:id/role body:", req.body);  // 👈 add this temporarily
  const { role } = req.body ?? {};


  if (!role || !Object.values(Role).includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const targetUser = await UserModel.findById(req.params.id);
  if (!targetUser) return res.status(404).json({ error: "User not found" });

  // Only log if the role actually changed
  if (targetUser.role !== role) {
    // update role
    targetUser.role = role;
    await targetUser.save();

    // ✅ Log the change
    await AuditModel.create({
      actorId: req.user!.id,           // the admin performing the change
      targetUserId: targetUser._id,    // the user whose role changed
      oldRole: targetUser.role,        // careful: we must log old role before updating
      newRole: role,
      timestamp: new Date(),
    });
  }

  res.json({ id: targetUser._id, email: targetUser.email, role: targetUser.role });
});

// View audit logs (Admin only)
router.get("/audits", authenticate, can("users:manage"), async (_req, res) => {
  const logs = await AuditModel.find()
    .populate("actorId", "email")
    .populate("targetUserId", "email")
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(
    logs.map(log => ({
      actor: log.actorId ? (log.actorId as any).email : null,
      target: log.targetUserId ? (log.targetUserId as any).email : null,
      oldRole: log.oldRole,
      newRole: log.newRole,
      at: log.timestamp,
    }))
  );
});


export default router;
