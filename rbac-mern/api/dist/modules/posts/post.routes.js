"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_model_1 = require("../../models/post.model");
const authenticate_1 = require("../../middleware/authenticate");
const authorize_1 = require("../../middleware/authorize"); // replaces missing "can"
const router = express_1.default.Router();
// ✅ Delete post
router.delete("/:id", authenticate_1.authenticate, (0, authorize_1.can)("posts:delete"), async (req, res) => {
    const { id } = req.params;
    // Find post first
    const post = await post_model_1.PostModel.findById(id);
    if (!post)
        return res.status(404).json({ error: "Post not found" });
    // Ownership check for editors
    if (req.user?.role === "Editor" && post.authorId.toString() !== req.user.id.toString()) {
        return res.status(403).json({ error: "Forbidden — not your post" });
    }
    await post_model_1.PostModel.findByIdAndDelete(id);
    return res.json({ message: "Post deleted successfully" });
});
exports.default = router;
