import { Router } from "express";
import { PostModel } from "../../models/post.model";
import { authenticate } from "../../middleware/authenticate";
import { can } from "../../middleware/authorize";
import mongoose from "mongoose";

const router = Router();

// GET /posts  (anyone with posts:read)
router.get("/", authenticate, can("posts:read"), async (req, res) => {
  // Readers can see all posts in this demo. If you want Editors to only see their own, add a filter here.
  const posts = await PostModel.find().sort({ createdAt: -1 }).limit(100);
  res.json(posts);
});

// POST /posts (create = set authorId to current user)
router.post("/", authenticate, can("posts:create"), async (req, res) => {
  const { title, body } = req.body ?? {};
  if (!title || !body) return res.status(400).json({ error: "title and body are required" });
  const post = await PostModel.create({
    title,
    body,
    authorId: new mongoose.Types.ObjectId(req.user!.id),
  });
  res.status(201).json(post);
});

// PUT /posts/:id  (Admin can update any; Editor only own)
router.put("/:id", authenticate, async (req, res, next) => {
  const post = await PostModel.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  req.resourceOwnerId = post.authorId.toString();
  next();
}, can("posts:update"), async (req, res) => {
  const { title, body } = req.body ?? {};
  const updated = await PostModel.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { ...(title && { title }), ...(body && { body }) } },
    { new: true }
  );
  res.json(updated);
});

// DELETE /posts/:id  (Admin any; Editor own)
router.delete("/:id", authenticate, async (req, res, next) => {
  const post = await PostModel.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "Not found" });
  req.resourceOwnerId = post.authorId.toString();
  next();
}, can("posts:delete"), async (req, res) => {
  await PostModel.deleteOne({ _id: req.params.id });
  res.status(204).end();
});

export default router;
