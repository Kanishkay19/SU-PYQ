import { IconPDF, IconEye, IconDownload, IconTrash } from "../ui/Icons";
import { fmtDate } from "../../utils/formatters";

function getViewUrl(url) {
  // Add pdf content type flag for mobile browsers
  return url.replace("/upload/", "/upload/fl_attachment:false/");
}

function getDownloadUrl(url, fileName) {
  // Force download with correct filename
  return url.replace("/upload/", `/upload/fl_attachment:${fileName}/`);
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