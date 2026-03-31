const BASE = "https://su-pyq.onrender.com/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ── Auth ──────────────────────────────────────────────────────
export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
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
    headers: authHeaders(), // no Content-Type — browser sets multipart automatically
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