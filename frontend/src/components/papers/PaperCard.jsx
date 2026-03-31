import { IconPDF, IconEye, IconDownload, IconTrash } from "../ui/Icons";
import { fmtDate } from "../../utils/formatters";

function getViewUrl(url) {
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}`;
}

function getDownloadUrl(url) {
  // Remove any existing fl_attachment flags first, then add clean one
  const cleanUrl = url.replace(/\/upload\/.*?\//, "/upload/");
  return cleanUrl.replace("/upload/", "/upload/fl_attachment/");
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
  onClick={() => {
    const a = document.createElement("a");
    a.href = getDownloadUrl(paper.cloudinaryUrl);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }}
>
  <IconDownload /> Download
</button>
      </div>
    </div>
  );
}