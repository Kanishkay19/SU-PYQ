import { IconPDF, IconEye, IconDownload, IconTrash } from "../ui/Icons";
import { fmtDate } from "../../utils/formatters";

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

function getViewUrl(url) {
  if (isMobile()) {
    const pdfUrl = url.includes(".pdf") ? url : `${url}.pdf`;
    return pdfUrl;
  }
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
}

function getDownloadUrl(url, fileName) {
  const base = url.replace(/\/upload\/[^/]*\//, "/upload/");
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.replace("/upload/", `/upload/fl_attachment:${cleanName}/`);
}

export default function PaperCard({ paper, isAdmin, onDelete, style }) {
  return (
    <div className="paper-card" style={style}>
      <div className="card-header">
        <div className="card-pdf-icon"><IconPDF /></div>
        {isAdmin && (
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
      <div className="card-uploaded">Uploaded: {fmtDate(paper.createdAt)}</div>
      <div className="card-actions">
        <button
          className="card-btn card-btn-view"
          onClick={() => window.open(getViewUrl(paper.cloudinaryUrl), "_blank")}
        >
          <IconEye /> View
        </button>
        <button
          className="card-btn card-btn-dl"
          onClick={() => window.open(getDownloadUrl(paper.cloudinaryUrl, paper.fileName), "_blank")}
        >
          <IconDownload /> Download
        </button>
      </div>
    </div>
  );
}