import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/useAuth";

type Post = {
  id: string;
  title: string;
  body: string;
  authorId: string;
};

export default function Posts() {
  const { user, can, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");

  // New post form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get<Post[]>("/posts");
      setPosts(data);
    } catch (e: any) {
      setMsg("Failed to load posts");
      setMsgType("error");
    }
  };

  const deletePost = async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(prev => prev.filter(p => p.id !== id));
      setMsg("Post deleted successfully");
      setMsgType("success");
    } catch (e: any) {
      setMsg("Failed to delete post");
      setMsgType("error");
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    try {
      const { data } = await api.post<Post>("/posts", { title, body });
      setPosts(prev => [data, ...prev]);
      setTitle("");
      setBody("");
      setMsg("Post created successfully");
      setMsgType("success");
    } catch (e: any) {
      setMsg("Failed to create post");
      setMsgType("error");
    }
  };

  return (
    <div className="container">
      <header>
        <div>
          <h2>Posts</h2>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Logged in as <b>{user?.role}</b> (id: {user?.id})
          </div>
        </div>

        <div>
          {can("users:manage") && <a href="/admin">Admin</a>}
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {msg && <div className={`message ${msgType}`}>{msg}</div>}

      {/* ✅ Create Post Form — visible only to Editors or Admins */}
      {(can("posts:create") || can("users:manage")) && (
        <form onSubmit={createPost} style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Post content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
            style={{
              width: "100%",
              padding: "0.6rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "0.5rem",
              fontFamily: "inherit",
            }}
          />
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            Add Post
          </button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.body}</td>
              <td>
                {can("posts:delete") && (
                  <button onClick={() => deletePost(p.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
