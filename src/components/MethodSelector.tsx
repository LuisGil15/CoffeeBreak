import { useEffect, useRef } from "react";
import { BrewMethodId, CoffeeMethod } from "../domain/types";

interface MethodSelectorProps {
  methods: CoffeeMethod[];
  value: BrewMethodId;
  onChange: (id: BrewMethodId) => void;
}

export const MethodSelector = ({
  methods,
  value,
  onChange,
}: MethodSelectorProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = gridRef.current;
    const selected = grid?.querySelector<HTMLElement>(".method-card.selected");
    if (!grid || !selected) return;
    const gridBounds = grid.getBoundingClientRect();
    const cardBounds = selected.getBoundingClientRect();
    const clippedHorizontally = cardBounds.left < gridBounds.left || cardBounds.right > gridBounds.right;
    if (clippedHorizontally) {
      selected.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [value]);
  return (
    <section className="method-selector">
      <div className="section-heading">
        <h2>Método de extracción</h2>
        <small>Elige uno</small>
      </div>
      <div className="method-grid" ref={gridRef}>
        {methods.filter((method) => method.implemented).map((method) => {
          const selected = method.id === value;
          return (
            <button
              key={method.id}
              type="button"
              className={`method-card ${selected ? "selected" : ""} ${
                method.implemented ? "implemented" : "coming-soon"
              }`}
              onClick={() => onChange(method.id)}
              aria-pressed={selected}
              aria-label={`Seleccionar método ${method.name}`}
            >
              {method.imageUrl ? (
                <span className="method-visual" aria-hidden="true">
                  <img src={method.imageUrl} alt="" className="method-image" loading="eager" decoding="async" />
                </span>
              ) : <span className="method-preview-jar" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M20 8h24v7H20zM17 17h30v37H17z"/><path d="M21 34h22v16H21z"/><path d="M23 23h18M24 27h16"/></svg></span>}
              <div className="method-card-title">
                <span>{method.name}</span>
                {selected && <b aria-hidden="true">✓</b>}
                {!method.implemented && <small>Próximamente</small>}
              </div>
              <p>{method.description}</p>
              <p className="method-meta">
                {method.implemented ? "Completo en este MVP" : "Referencia inicial"}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
