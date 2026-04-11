const BASE = "https://su-pyq.onrender.com/api";
// const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ── Auth ──────────────────────────────────────────────────────
export async function requestOtp(email) {
  const res = await fetch(`${BASE}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid OTP");
  localStorage.setItem("token", data.token);
  return data;
}

export async function adminLogin(password) {
  const res = await fetch(`${BASE}/auth/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid credentials");
  localStorage.setItem("token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

// ── Papers ────────────────────────────────────────────────────
export async function fetchPapers() {
  const res = await fetch(`${BASE}/papers`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch papers");
  return res.json();
}

export async function uploadPaper(formData) {
  const res = await fetch(`${BASE}/papers`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function deletePaper(id) {
  const res = await fetch(`${BASE}/papers/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}