import { SavedRecipeRef } from "../domain/types";

interface HistoryPanelProps {
  history: SavedRecipeRef[];
  onApply: (input: SavedRecipeRef["input"]) => void;
  onClear: () => void;
}

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));

export const HistoryPanel = ({
  history,
  onApply,
  onClear,
}: HistoryPanelProps) => (
  <section>
    <div className="panel-header">
      <h2>Historial</h2>
      <button type="button" className="ghost-btn" onClick={onClear}>
        Borrar
      </button>
    </div>
    {history.length === 0 ? (
      <p className="empty-note">No hay historial todavía. Cambia los valores y verás tu progreso.</p>
    ) : (
      <ul className="compact-list">
        {history.map((entry) => (
          <li key={entry.id} className="saved-row">
            <button
              type="button"
              className="saved-main"
              onClick={() => onApply(entry.input)}
              aria-label={`Cargar del historial ${entry.label}`}
            >
              <p>
                <strong>{entry.label}</strong>
              </p>
              <small>
                1:{entry.snapshot.ratio} · {entry.snapshot.totalDrinkMl} ml ·{" "}
                {entry.snapshot.extractionWaterMl} ml de agua
              </small>
              <small className="saved-meta">{formatDate(entry.createdAt)}</small>
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);
