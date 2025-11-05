import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/useAuth";

type Role = "Admin" | "Editor" | "Viewer";
type UserRow = { id: string; email: string; role: Role };

export default function Admin() {
  const { can } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!can("users:manage")) return;
    api.get<UserRow[]>("/admin/users")
      .then(r => setUsers(r.data))
      .catch(e => setMsg(e?.response?.data?.error || "Failed to load users"));
  }, [can]);

  const updateRole = async (id: string, role: Role) => {
    setMsg("");
    try {
      const { data } = await api.patch<UserRow>(`/admin/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => (u.id === id ? data : u)));
      setMsg("Role updated");
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "Update failed");
    }
  };

  if (!can("users:manage")) return <div style={{ padding: 24 }}>Forbidden</div>;

  return (
    <div style={{ maxWidth: 720, margin: "32px auto", fontFamily: "sans-serif" }}>
      <h2>Admin · Users</h2>
      {msg && <div style={{ color: "green", marginBottom: 8 }}>{msg}</div>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Email</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Role</th>
            <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: "6px 0" }}>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => updateRole(u.id, e.target.value as Role)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
