import { useState, useRef } from "react";
import { IconClose } from "../ui/Icons";
import { SEMESTERS } from "../../constants";

export default function UploadModal({ onClose, onSubmit }) {
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const canSubmit = subject.trim() && year && semester && file;

  const handleFile = (f) => {
    if (f && f.type === "application/pdf") setFile(f);
    else alert("Please select a valid PDF file.");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      fd.append("subject", subject.trim());
      fd.append("year", year);
      fd.append("semester", semester);
      await onSubmit(fd);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Upload Question Paper</div>
          <button className="modal-close" onClick={onClose}><IconClose /></button>
        </div>

        <div className="form-field">
          <label className="form-label">Subject Name</label>
          <input className="form-input" placeholder="e.g. Data Structures" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Year</label>
            <input className="form-input" type="number" placeholder="e.g. 2024" min="2000" max="2099" value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="form-label">Semester</label>
            <select className="form-select" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">Select…</option>
              {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">PDF File</label>
          <div
            className={`file-drop ${drag ? "dragover" : ""} ${file ? "file-chosen" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
          >
            <input type="file" accept=".pdf" ref={fileRef} onChange={e => handleFile(e.target.files[0])} />
            <div className="file-drop-icon">{file ? "✅" : "📄"}</div>
            <div className="file-drop-text">
              {file
                ? <>{file.name}<br /><span style={{ fontSize: "0.75rem", fontWeight: 400 }}>{(file.size / 1024).toFixed(1)} KB</span></>
                : <><strong>Click to browse</strong> or drag & drop<br />PDF files only</>
              }
            </div>
          </div>
        </div>

        <button className="submit-btn" disabled={!canSubmit || submitting} onClick={handleSubmit}>
          {submitting ? "Uploading…" : "Upload Question Paper"}
        </button>
      </div>
    </div>
  );
}