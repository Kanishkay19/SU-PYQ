import { IconPDF, IconEye, IconDownload, IconTrash } from "../ui/Icons";
import { fmtDate } from "../../utils/formatters";

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
  onClick={() => window.open(paper.cloudinaryUrl, "_blank")}
>
  <IconEye /> View
</button>

// Download button — forces correct download with original filename
<button
  className="card-btn card-btn-dl"
  onClick={() => {
    const url = paper.cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
    window.open(url, "_blank");
  }}
>
  <IconDownload /> Download
</button>
      </div>
    </div>
  );
}