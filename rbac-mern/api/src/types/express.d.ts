import "express";

declare global {
  namespace Express {
    interface UserClaims {
      id: string;
      role: "Admin" | "Editor" | "Viewer";
      perms: string[];
    }
    interface Request {
      user?: UserClaims;
      resourceOwnerId?: string;
      correlationId?: string;
    }
  }
}

export {};
