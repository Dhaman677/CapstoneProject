import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/useAuth";

export default function PostsPage() {
  const { user, can } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  // Load existing posts
  useEffect(() => {
    api.get("/posts")
      .then((res) => setPosts(res.data))
      .catch(() => setMsg("Failed to load posts"));
  }, []);

  // Create new post
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const { data } = await api.post("/posts", { title, body });
      setPosts((prev) => [data, ...prev]);
      setTitle("");
      setBody("");
      setMsg("✅ Post created successfully!");
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "❌ Failed to create post");
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "30px auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Posts</h2>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Logged in as <b>{user?.role}</b>
          </div>
        </div>
      </header>

      {/* Show create form only if user has posts:create */}
      {can("posts:create") && (
        <form onSubmit={createPost} style={{ margin: "12px 0", display: "grid", gap: 8 }}>
          <input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Post Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
          />
          <button type="submit" disabled={!title || !body}>
            Create Post
          </button>
        </form>
      )}

      {msg && <div style={{ color: msg.startsWith("✅") ? "green" : "red", marginBottom: 8 }}>{msg}</div>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((p) => (
          <li
            key={p._id || p.id}
            style={{
              border: "1px solid #ddd",
              padding: 10,
              margin: "8px 0",
              borderRadius: 4,
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.body}</p>
            <small>Author: {p.authorId}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
