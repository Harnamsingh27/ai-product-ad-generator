import type { Generation } from "../types";

interface HistorySidebarProps {
  generations: Generation[];
  selectedId: string | null;
  onSelect: (generation: Generation) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function HistorySidebar({
  generations,
  selectedId,
  onSelect,
  onDelete,
  onClearAll,
}: HistorySidebarProps) {
  return (
    <div className="card history-sidebar">
      <div className="history-header">
        <h2>History</h2>
        {generations.length > 0 && (
          <button type="button" className="clear-history-button" onClick={onClearAll}>
            Clear all
          </button>
        )}
      </div>

      {generations.length === 0 && <p className="empty-state">No generations yet.</p>}

      <ul className="history-list">
        {generations.map((generation) => (
          <li
            key={generation.id}
            className={`history-item ${generation.id === selectedId ? "selected" : ""}`}
          >
            <button type="button" className="history-item-button" onClick={() => onSelect(generation)}>
              <span className="history-item-title">{generation.productName}</span>
              <span className="history-item-subtitle">{generation.brandName}</span>
            </button>
            <button
              type="button"
              className="history-item-delete"
              onClick={() => onDelete(generation.id)}
              aria-label={`Delete ${generation.productName}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
