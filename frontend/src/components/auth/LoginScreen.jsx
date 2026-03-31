import { useState } from "react";
import { login } from "../../api/papers";

export default function LoginScreen({ onLogin }) {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await login(username, password);
      // make sure the role matches the selected tab
      if (data.role !== role) {
        setError(`These credentials belong to a ${data.role}, not a ${role}.`);
        return;
      }
      onLogin({ role: data.role, name: data.name });
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-noise" />
      <div className="login-deco login-deco-1" />
      <div className="login-deco login-deco-2" />
      <div className="login-card">
        <div className="login-logo">SU-PYQ</div>
        <div className="login-sub">Previous Year Question Paper Repository</div>
        <div className="login-tabs">
          <button className={`login-tab ${role === "user" ? "active" : ""}`} onClick={() => setRole("user")}>Student</button>
          <button className={`login-tab ${role === "admin" ? "active" : ""}`} onClick={() => setRole("admin")}>Admin</button>
        </div>
        {error && <div className="login-error">⚠ {error}</div>}
        <div className="login-field">
          <label className="login-label">Username</label>
          <input
            className="login-input"
            placeholder={role === "admin" ? "admin" : "student"}
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
        </div>
        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()}
          />
        </div>
        <button className="login-btn" onClick={handle} disabled={loading}>
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        <div className="login-hint">
          <strong>Demo credentials</strong><br />
          Student → <code>student / student123</code><br />
          Admin → <code>admin / admin123</code>
        </div>
      </div>
    </div>
  );
}