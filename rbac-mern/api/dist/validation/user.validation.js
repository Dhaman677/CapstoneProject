"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoleSchema = void 0;
const zod_1 = require("zod");
exports.updateRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["Admin", "Editor", "Viewer"]),
});
