import { Request, Response, NextFunction } from "express";

function hasPermission(req: Request, perm: string): boolean {
  return !!req.user?.perms.includes(perm);
}

/** Usage: router.put('/posts/:id', loadPostOwner, can('posts:update'), updateHandler) */
export function can(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Full permission (e.g., Admin with 'posts:update')
    if (hasPermission(req, permission)) return next();

    // Ownership variants like 'posts:update:own' or 'posts:delete:own'
    const ownPerm = `${permission}:own`;
    if (hasPermission(req, ownPerm)) {
      if (!req.resourceOwnerId) return res.status(403).json({ error: "Forbidden" });
      if (req.resourceOwnerId.toString() === req.user.id.toString()) return next();
    }

    return res.status(403).json({ error: "Forbidden" });
  };
}

/** Helper middleware to set resourceOwnerId on req */
export function setOwner(ownerId: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.resourceOwnerId = ownerId;
    next();
  };
}
