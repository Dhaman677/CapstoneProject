import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { login, refresh, user } = useAuth();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Passw0rd!");
  const [error, setError] = useState("");

  useEffect(() => {
    // try to refresh on first load (uses cookie)
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) nav("/");
  }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}
        <button style={{ marginTop: 12 }} type="submit">Sign in</button>
      </form>
      <p style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
        Try: admin@demo.com / editor@demo.com / viewer@demo.com (Passw0rd!)
      </p>
    </div>
  );
}
