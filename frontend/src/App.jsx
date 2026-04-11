import { useState, useEffect, useMemo } from "react";
import { fetchPapers, uploadPaper, deletePaper } from "./api/papers";
import LoginScreen from "./components/auth/LoginScreen";
import Header from "./components/layout/Header";
import PapersGrid from "./components/papers/PapersGrid";
import UploadModal from "./components/upload/UploadModal";
import { IconUpload, IconFilter } from "./components/ui/Icons";

export default function App() {
  const [user, setUser] = useState(null);
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load papers from backend whenever user logs in
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchPapers()
      .then(setPapers)
      .catch(() => setError("Failed to load papers. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [user]);

  // Auto-derived filter options
  const years = useMemo(() =>
    [...new Set(papers.map(p => p.year))].sort((a, b) => b - a), [papers]);

  const subjects = useMemo(() =>
    [...new Set(papers.map(p => p.subject))].sort(), [papers]);

  const filtered = useMemo(() => {
    return papers.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        p.subject.toLowerCase().includes(q) ||
        String(p.year).includes(q) ||
        p.semester.toLowerCase().includes(q);
      const matchYear = filterYear === "All" || p.year === filterYear;
      const matchSubject = filterSubject === "All" || p.subject === filterSubject;
      return matchSearch && matchYear && matchSubject;
    });
  }, [papers, search, filterYear, filterSubject]);

  const handleAddPaper = async (formData) => {
    try {
      const newPaper = await uploadPaper(formData);
      setPapers(prev => [newPaper, ...prev]);
      setSuccess("Question paper uploaded successfully!");
      setTimeout(() => setSuccess(""), 3500);
      setShowUpload(false);
    } catch {
      setError("Upload failed. Please try again.");
      setTimeout(() => setError(""), 3500);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this paper?")) return;
    try {
      await deletePaper(id);
      setPapers(prev => prev.filter(p => p._id !== id));
    } catch {
      setError("Delete failed. Please try again.");
      setTimeout(() => setError(""), 3500);
    }
  };

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div className="app">
      <Header user={user} onLogout={() => setUser(null)} />

      <main className="main">
        {success && <div className="success-banner">✓ {success}</div>}
        {error && <div className="login-error">⚠ {error}</div>}

        {/* Search */}
        <div className="search-section">
          <div className="search-bar-wrap">
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              className="search-input"
              placeholder="Search by subject, year, semester…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filters-row">
            <span className="filter-label"><IconFilter /> Year</span>
            <div className="filter-chip-group">
              <button className={`filter-chip ${filterYear === "All" ? "active" : ""}`} onClick={() => setFilterYear("All")}>All</button>
              {years.map(y => (
                <button key={y} className={`filter-chip ${filterYear === y ? "active" : ""}`} onClick={() => setFilterYear(y)}>{y}</button>
              ))}
            </div>
            <div className="filter-sep" />
            <span className="filter-label">Subject</span>
            <div className="filter-chip-group">
              <button className={`filter-chip ${filterSubject === "All" ? "active" : ""}`} onClick={() => setFilterSubject("All")}>All</button>
              {subjects.map(s => (
                <button key={s} className={`filter-chip ${filterSubject === s ? "active" : ""}`} onClick={() => setFilterSubject(s)}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <p className="stats-count">
            {loading
              ? "Loading papers…"
              : <>Showing <strong>{filtered.length}</strong> of {papers.length} question papers</>
            }
          </p>
        </div>

        <PapersGrid
  papers={filtered}
  user={user}
  onDelete={handleDelete}
/>
      </main>

      <button className="fab" onClick={() => setShowUpload(true)}>
  <IconUpload /> Upload Paper
</button>
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSubmit={handleAddPaper}
        />
      )}
    </div>
  );
}