import { useState } from "react";
import { requestOtp, verifyOtp, adminLogin } from "../../api/papers";

export default function LoginScreen({ onLogin }) {
  const [role, setRole]       = useState("student");
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep]       = useState(1); // 1 = enter email, 2 = enter OTP
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleTabSwitch = (r) => {
    setRole(r);
    setStep(1);
    setEmail("");
    setOtp("");
    setPassword("");
    setError("");
    setSent(false);
  };

  // Student: step 1 — send OTP
  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await requestOtp(email);
      setSent(true);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Student: step 2 — verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await verifyOtp(email, otp);
      onLogin({ role: data.role, name: data.email });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Admin: password login
  const handleAdminLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin(password);
      onLogin({ role: data.role, name: data.email });
    } catch (err) {
      setError(err.message);
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
          <button
            className={`login-tab ${role === "student" ? "active" : ""}`}
            onClick={() => handleTabSwitch("student")}
          >Student</button>
          <button
            className={`login-tab ${role === "admin" ? "active" : ""}`}
            onClick={() => handleTabSwitch("admin")}
          >Admin</button>
        </div>

        {error && <div className="login-error">⚠ {error}</div>}

        {/* ── Student flow ── */}
        {role === "student" && step === 1 && (
          <>
            <div className="login-field">
              <label className="login-label">
  OTP sent to<br />
  <span style={{ fontWeight: 600, wordBreak: "break-all", fontSize: "0.78rem" }}>
    {email}
  </span>
</label>
              <input
                className="login-input"
                type="email"
                placeholder="yourname@sushantuniversity.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleRequestOtp()}
              />
            </div>
            <button
              className="login-btn"
              onClick={handleRequestOtp}
              disabled={loading || !email}
            >
              {loading ? "Sending OTP…" : "Send OTP →"}
            </button>
          </>
        )}

        {role === "student" && step === 2 && (
          <>
            <div className="login-field">
              <label className="login-label">OTP sent to {email}</label>
              <input
                className="login-input"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
                maxLength={6}
              />
            </div>
            <button
              className="login-btn"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying…" : "Verify OTP →"}
            </button>
            <button
              className="login-hint"
              style={{ background: "none", border: "none", cursor: "pointer", marginTop: "8px" }}
              onClick={() => { setStep(1); setOtp(""); setError(""); }}
            >
              ← Change email
            </button>
          </>
        )}

        {/* ── Admin flow ── */}
        {role === "admin" && (
          <>
            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              />
            </div>
            <button
              className="login-btn"
              onClick={handleAdminLogin}
              disabled={loading || !password}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}