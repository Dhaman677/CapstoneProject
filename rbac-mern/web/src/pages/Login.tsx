import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    try {
      await login(email, password);
      setMsg("Login successful!");
      setMsgType("success");

      // ✅ Redirect to posts page after successful login
      setTimeout(() => navigate("/"), 600);
    } catch (err: any) {
      setMsg(err?.response?.data?.error || "Login failed");
      setMsgType("error");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {msg && <div className={`message ${msgType}`}>{msg}</div>}
    </div>
  );
}
