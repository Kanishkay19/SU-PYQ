import { IconPDF, IconEye, IconDownload, IconTrash } from "../ui/Icons";
import { fmtDate } from "../../utils/formatters";

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

function getViewUrl(url) {
  if (isMobile()) return url;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
}

export default function PaperCard({ paper, user, onDelete, style }) {
  // show delete if admin OR if this paper belongs to the logged in user
  const canDelete =
    user.role === "admin" || paper.uploaderEmail === user.name;

  return (
    <div className="paper-card" style={style}>
      <div className="card-header">
        <div className="card-pdf-icon"><IconPDF /></div>
        {canDelete && (
          <div className="card-admin-actions">
            <button className="card-del-btn" onClick={onDelete} title="Delete">
              <IconTrash />
            </button>
          </div>
        )}
      </div>
      <div className="card-subject">{paper.subject}</div>
      <div className="card-meta">
        <span className="meta-pill year">{paper.year}</span>
        <span className="meta-pill">Sem {paper.semester}</span>
      </div>
      <div className="card-filename">📄 {paper.fileName}</div>
      <div className="card-uploaded">
        Uploaded by: <strong>{paper.uploaderEmail}</strong>
      </div>
      <div className="card-uploaded">{fmtDate(paper.createdAt)}</div>
      <div className="card-actions">
        <button
          className="card-btn card-btn-view"
          onClick={() => window.open(getViewUrl(paper.supabaseUrl), "_blank")}
        >
          <IconEye /> View
        </button>
        <button
          className="card-btn card-btn-dl"
          onClick={() => window.open(paper.supabaseUrl, "_blank")}
        >
          <IconDownload /> Download
        </button>
      </div>
    </div>
  );
}