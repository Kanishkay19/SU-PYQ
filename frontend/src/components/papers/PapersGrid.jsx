import PaperCard from "./PaperCard";

export default function PapersGrid({ papers, user, onDelete }) {
  if (papers.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">📂</div>
        <h3>No papers found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="papers-grid">
      {papers.map((p, i) => (
        <PaperCard
          key={p._id}
          paper={p}
          user={user}
          onDelete={() => onDelete(p._id)}
          style={{ animationDelay: `${i * 0.04}s` }}
        />
      ))}
    </div>
  );
}