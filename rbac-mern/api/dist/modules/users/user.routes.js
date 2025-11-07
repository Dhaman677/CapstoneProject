"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../../middleware/authenticate");
const authorize_1 = require("../../middleware/authorize");
const user_model_1 = require("../../models/user.model");
const audit_model_1 = require("../../models/audit.model");
const router = (0, express_1.Router)();
// List users (email, role, id) — Admin only
router.get("/", authenticate_1.authenticate, (0, authorize_1.can)("users:manage"), async (_req, res) => {
    const users = await user_model_1.UserModel.find({}, { email: 1, role: 1 }).sort({ createdAt: -1 });
    res.json(users.map(u => ({ id: u._id, email: u.email, role: u.role })));
});
router.patch("/:id/role", authenticate_1.authenticate, (0, authorize_1.can)("users:manage"), async (req, res) => {
    console.log("PATCH /admin/users/:id/role body:", req.body);
    const { id } = req.params;
    const { role } = req.body;
    const targetUser = await user_model_1.UserModel.findById(id);
    if (!targetUser)
        return res.status(404).json({ error: "User not found" });
    // ✅ capture BEFORE changing
    const oldRole = targetUser.role;
    if (oldRole !== role) {
        targetUser.role = role;
        await targetUser.save();
        await audit_model_1.AuditModel.create({
            actorId: req.user.id,
            targetUserId: targetUser._id,
            oldRole, // ✅ correct old value
            newRole: role,
            timestamp: new Date(),
        });
    }
    return res.json({ id: targetUser._id, email: targetUser.email, role: targetUser.role });
});
// View audit logs (Admin only)
router.get("/audits", authenticate_1.authenticate, (0, authorize_1.can)("users:manage"), async (_req, res) => {
    const logs = await audit_model_1.AuditModel.find()
        .populate("actorId", "email")
        .populate("targetUserId", "email")
        .sort({ timestamp: -1 })
        .limit(50);
    res.json(logs.map(log => ({
        actor: log.actorId ? log.actorId.email : null,
        target: log.targetUserId ? log.targetUserId.email : null,
        oldRole: log.oldRole,
        newRole: log.newRole,
        at: log.timestamp,
    })));
});
exports.default = router;
