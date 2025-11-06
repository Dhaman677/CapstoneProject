import express from "express";
import { PostModel } from "../../models/post.model";
import { authenticate } from "../../middleware/authenticate";
import { can } from "../../middleware/authorize";  // replaces missing "can"
import { validate } from "../../middleware/validate"; // if you have it

const router = express.Router();

// ✅ Delete post
router.delete("/:id", authenticate, can("posts:delete"), async (req, res) => {
  const { id } = req.params;

  // Find post first
  const post = await PostModel.findById(id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  // Ownership check for editors
  if (req.user?.role === "Editor" && post.authorId.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: "Forbidden — not your post" });
  }

  await PostModel.findByIdAndDelete(id);
  return res.json({ message: "Post deleted successfully" });
});

export default router;
