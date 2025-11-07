"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.can = can;
exports.setOwner = setOwner;
const metrics_1 = require("./metrics");
function hasPermission(req, perm) {
    return !!req.user?.perms.includes(perm);
}
/** Usage: router.put('/posts/:id', loadPostOwner, can('posts:update'), updateHandler) */
function can(permission) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        // Full permission (e.g., Admin with 'posts:update')
        if (hasPermission(req, permission))
            return next();
        // Ownership variants like 'posts:update:own' or 'posts:delete:own'
        const ownPerm = `${permission}:own`;
        if (hasPermission(req, ownPerm)) {
            if (!req.resourceOwnerId)
                return res.status(403).json({ error: "Forbidden" });
            if (req.resourceOwnerId.toString() === req.user.id.toString())
                return next();
        }
        (0, metrics_1.recordAuthDenial)(req);
        return res.status(403).json({ error: "Forbidden" });
    };
}
/** Helper middleware to set resourceOwnerId on req */
function setOwner(ownerId) {
    return (req, _res, next) => {
        req.resourceOwnerId = ownerId;
        next();
    };
}
