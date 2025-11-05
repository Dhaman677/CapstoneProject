export const Role = {
  Admin: "Admin",
  Editor: "Editor",
  Viewer: "Viewer",
} as const;
export type RoleKey = keyof typeof Role;
export type RoleValue = (typeof Role)[RoleKey];

export const Permissions = {
  PostsCreate: "posts:create",
  PostsRead: "posts:read",
  PostsUpdate: "posts:update",
  PostsDelete: "posts:delete",
  PostsUpdateOwn: "posts:update:own",
  PostsDeleteOwn: "posts:delete:own",
  UsersManage: "users:manage",
} as const;
export type Permission = (typeof Permissions)[keyof typeof Permissions];

export const RoleMatrix: Record<RoleValue, Permission[]> = {
  Admin: [
    Permissions.PostsCreate,
    Permissions.PostsRead,
    Permissions.PostsUpdate,
    Permissions.PostsDelete,
    Permissions.UsersManage,
  ],
  Editor: [
    Permissions.PostsCreate,
    Permissions.PostsRead,
    Permissions.PostsUpdateOwn,
    Permissions.PostsDeleteOwn,
  ],
  Viewer: [Permissions.PostsRead],
};

export function permissionsForRole(role: RoleValue): Permission[] {
  return RoleMatrix[role];
}
