import { Router } from "express";
import { PostModel } from "../../models/post.model";
import { authenticate } from "../../middleware/authenticate";
import { can } from "../../middleware/authorize";

const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ message: "Posts API is alive 🚀" });
});

// ✅ Real posts from MongoDB
router.get("/", async (_req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

router.post("/", authenticate, can("posts:create"), async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: "Missing fields" });

    const post = await PostModel.create({
      title,
      body,
      authorId: req.user!.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

export default router;