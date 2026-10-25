import { useMemo, useState } from "react";
import { cafeDrinkRecipes } from "../data/cafeDrinkRecipes";

export const CafeDrinkLibrary = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(cafeDrinkRecipes[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const recipes = useMemo(
    () => cafeDrinkRecipes.filter((recipe) => `${recipe.name} ${recipe.summary}`.toLowerCase().includes(search.toLowerCase())),
    [search],
  );
  const selected = recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];

  const chooseRecipe = (id: string) => {
    setSelectedId(id);
    setStepIndex(0);
  };

  return (
    <section className="cafe-library" aria-label="Recetas de bebidas de cafetería">
      <div className="cafe-library-intro">
        <div>
          <h2>Un clásico de cafetería, en casa</h2>
          <p>Ingredientes medidos y pasos claros para preparar una taza.</p>
        </div>
        <label className="drink-search">
          <span>Buscar bebida</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Capuchino, chai…" />
        </label>
      </div>
      <div className="cafe-recipes-layout">
        <div className="drink-list" aria-label="Bebidas">
          {recipes.length ? recipes.map((recipe, index) => (
            <button
              type="button"
              key={recipe.id}
              className={`drink-choice ${selected?.id === recipe.id ? "selected" : ""}`}
              onClick={() => chooseRecipe(recipe.id)}
              style={{ "--row-index": index } as React.CSSProperties}
              aria-pressed={selected?.id === recipe.id}
            >
              <span className="drink-choice-copy"><strong>{recipe.name}</strong><small>{recipe.summary}</small></span>
              <span className="drink-choice-arrow" aria-hidden="true">↗</span>
            </button>
          )) : <p className="empty-note">No encontré esa bebida. Prueba con “latte” o “chai”.</p>}
        </div>
        {selected && <article className="drink-recipe-detail" key={selected.id}>
          <header className="drink-detail-heading">
            <div>
              <span className="drink-type-label">{selected.style === "tea" ? "Té especiado" : "Con espresso"} · 1 taza</span>
              <h3>{selected.name}</h3>
              <p>{selected.summary}</p>
            </div>
            <div className={`drink-glass ${selected.style}`} aria-label={`Capas de ${selected.name}`} role="img">
              {selected.cupLayers.map((layer, index) => <span className={`glass-layer layer-${index}`} key={layer} title={layer} style={{ "--layer-index": index } as React.CSSProperties} />)}
            </div>
          </header>
          <div className="drink-ingredients">
            <h4>Necesitas</h4>
            <ul>{selected.baseIngredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
          </div>
          <div className="drink-stepper">
            <div className="drink-step-heading"><h4>Preparación</h4><span>Paso {stepIndex + 1} de {selected.steps.length}</span></div>
            <div className="timeline-track" aria-hidden="true">{selected.steps.map((step, index) => <span key={step} className={`timeline-dot ${index <= stepIndex ? "active" : ""}`} />)}</div>
            <p className="drink-step-copy" key={`${selected.id}-${stepIndex}`} aria-live="polite">{selected.steps[stepIndex]}</p>
            <div className="drink-step-actions">
              <button type="button" onClick={() => setStepIndex((value) => Math.max(0, value - 1))} disabled={stepIndex === 0}>← Anterior</button>
              <button type="button" className="primary-btn" onClick={() => setStepIndex((value) => Math.min(selected.steps.length - 1, value + 1))} disabled={stepIndex === selected.steps.length - 1}>{stepIndex === selected.steps.length - 1 ? "Lista ✓" : "Siguiente →"}</button>
            </div>
          </div>
          <a className="recipe-source" href={selected.source.url} target="_blank" rel="noreferrer">Receta de referencia: {selected.source.label} ↗</a>
        </article>}
      </div>
    </section>
  );
};
