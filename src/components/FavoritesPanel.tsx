import { SavedRecipeRef } from "../domain/types";

interface FavoritesPanelProps {
  favorites: SavedRecipeRef[];
  onApply: (input: SavedRecipeRef["input"]) => void;
  onDelete: (id: string) => void;
}

const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

export const FavoritesPanel = ({
  favorites,
  onApply,
  onDelete,
}: FavoritesPanelProps) => (
  <section>
    <div className="panel-header">
      <h2>Favoritos</h2>
      <small>{favorites.length}</small>
    </div>
    {favorites.length === 0 ? (
      <p className="empty-note">Aún no tienes favoritos. Guarda tu receta favorita para verla aquí.</p>
    ) : (
      <ul className="compact-list">
        {favorites.map((favorite) => (
          <li key={favorite.id} className="saved-row">
            <button
              type="button"
              className="saved-main"
              onClick={() => onApply(favorite.input)}
              aria-label={`Cargar favorito ${favorite.label}`}
            >
              <p>
                <strong>{favorite.label}</strong>
              </p>
              <small>
                1:{favorite.snapshot.ratio} · {favorite.snapshot.totalDrinkMl} ml ·{" "}
                {favorite.snapshot.coffeeGrams} g
              </small>
              <small className="saved-meta">Guardado {formatDate(favorite.createdAt)}</small>
            </button>
            <button
              type="button"
              className="delete-btn"
              onClick={() => onDelete(favorite.id)}
              aria-label={`Eliminar favorito ${favorite.label}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);
