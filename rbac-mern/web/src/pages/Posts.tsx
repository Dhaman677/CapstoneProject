import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/useAuth";

type Post = { _id: string; title: string; body: string; authorId: string };

export default function Posts() {
  const { user, can, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await api.get<Post[]>("/posts");
    setPosts(data);
  };

  useEffect(() => { load().catch(console.error); }, []);

  const create = async () => {
    setMsg("");
    try {
      await api.post("/posts", { title, body });
      setTitle(""); setBody("");
      await load();
      setMsg("Created!");
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Create failed");
    }
  };

  const update = async (id: string) => {
    const newTitle = prompt("New title?");
    if (!newTitle) return;
    setMsg("");
    try {
      await api.put(`/posts/${id}`, { title: newTitle });
      await load();
      setMsg("Updated!");
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Update failed (maybe not owner?)");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete post?")) return;
    setMsg("");
    try {
      await api.delete(`/posts/${id}`);
      await load();
      setMsg("Deleted!");
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Delete failed (maybe not owner?)");
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "30px auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Posts</h2>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            Logged in as <b>{user?.role}</b> (id: {user?.id})
          </div>
        </div>
        {can("users:manage") && (
         <a href="/admin" style={{ marginRight: 12 }}>Admin</a>
        )}

        <button onClick={logout}>Logout</button>
      </header>

      {can("posts:create") && (
        <div style={{ margin: "16px 0", padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <h4>Create post</h4>
          <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
          <br />
          <textarea placeholder="body" value={body} onChange={e => setBody(e.target.value)} />
          <br />
          <button onClick={create} disabled={!title || !body} title={!can("posts:create") ? "You don't have create permission" : ""}>
            Create
          </button>
        </div>
      )}

      {msg && <div style={{ marginBottom: 8, color: "green" }}>{msg}</div>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map(p => (
          <li key={p._id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{p.title}</b>
              <small>author: {p.authorId}</small>
            </div>
            <div style={{ whiteSpace: "pre-wrap", margin: "6px 0" }}>{p.body}</div>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Admin can update/delete any; Editor may get 403 when not owner */}
              <button
                onClick={() => update(p._id)}
                disabled={!can("posts:update") && !can("posts:update:own")}
                title={!can("posts:update") && !can("posts:update:own") ? "No update permission" : ""}
              >
                Edit
              </button>
              <button
                onClick={() => del(p._id)}
                disabled={!can("posts:delete") && !can("posts:delete:own")}
                title={!can("posts:delete") && !can("posts:delete:own") ? "No delete permission" : ""}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
