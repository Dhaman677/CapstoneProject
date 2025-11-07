"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMatrix = exports.Permissions = exports.Role = void 0;
exports.permissionsForRole = permissionsForRole;
exports.Role = {
    Admin: "Admin",
    Editor: "Editor",
    Viewer: "Viewer",
};
exports.Permissions = {
    PostsCreate: "posts:create",
    PostsRead: "posts:read",
    PostsUpdate: "posts:update",
    PostsDelete: "posts:delete",
    PostsUpdateOwn: "posts:update:own",
    PostsDeleteOwn: "posts:delete:own",
    UsersManage: "users:manage",
};
exports.RoleMatrix = {
    Admin: [
        exports.Permissions.PostsCreate,
        exports.Permissions.PostsRead,
        exports.Permissions.PostsUpdate,
        exports.Permissions.PostsDelete,
        exports.Permissions.UsersManage,
    ],
    Editor: [
        exports.Permissions.PostsCreate,
        exports.Permissions.PostsRead,
        exports.Permissions.PostsUpdateOwn,
        exports.Permissions.PostsDeleteOwn,
    ],
    Viewer: [exports.Permissions.PostsRead],
};
function permissionsForRole(role) {
    return exports.RoleMatrix[role];
}
