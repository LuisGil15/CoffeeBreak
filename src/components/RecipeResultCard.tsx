import { CoffeeRecipe } from "../domain/types";
import { useEffect, useState } from "react";

const labelForBeverage = (recipe: CoffeeRecipe): string => {
  if (recipe.milkMl > 0) {
    return "Con leche";
  }
  if (recipe.beverage === "iced") {
    return "Iced";
  }
  return "Negro";
};

interface RecipeResultCardProps {
  recipe: CoffeeRecipe;
  guided: boolean;
  onStart: () => void;
  onBack: () => void;
}

export const RecipeResultCard = ({ recipe, guided, onStart, onBack }: RecipeResultCardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const waterPerCupMl = Math.round(recipe.extractionWaterMl / recipe.cups);
  const milkPerCupMl = Math.round(recipe.milkMl / recipe.cups);

  useEffect(() => {
    setCurrentStep(0);
  }, [
    recipe.methodId,
    recipe.intensity,
    recipe.beverage,
    recipe.totalDrinkMl,
    recipe.coffeeGrams,
    recipe.extractionWaterMl,
    recipe.coldBrewMode,
  ]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === recipe.steps.length - 1;
  const nextDisabled = recipe.steps.length === 0 || isLastStep;
  const prevDisabled = recipe.steps.length === 0 || isFirstStep;

  const timeline = recipe.steps.map((step, index) => ({
    index,
    text: step,
    isDone: index < currentStep,
    isActive: index === currentStep,
  }));

  return (
    <section className={`recipe-card ${recipe.implemented ? "" : "reference"}`}>
      {guided ? <header className="guide-toolbar">
        <button type="button" onClick={onBack}>← Ajustar receta</button>
        <span>{recipe.methodId === "cold-brew" ? `Cold Brew · ${recipe.coldBrewMode === "concentrate" ? "Concentrado" : "Listo para tomar"}` : recipe.methodName}</span>
      </header> : <header className="recipe-header">
        <h2>{recipe.methodId === "cold-brew" ? "Cold Brew" : `Tu mezcla · ${recipe.methodName}`}</h2>
        <span>{recipe.cups} × {recipe.cupSizeMl} ml · {labelForBeverage(recipe)}</span>
      </header>}

      <div className="stats-grid">
        <div className="stat-item">
          <strong>{recipe.coffeeGrams} g</strong>
          <small>café</small>
        </div>
        <div className="stat-item">
          <strong>{recipe.methodId === "cold-brew" ? recipe.extractionWaterMl : waterPerCupMl} ml</strong>
          <small>{recipe.methodId === "cold-brew" ? "agua fría total" : recipe.cups > 1 ? "agua por taza" : "agua extracción"}</small>
        </div>
        {recipe.milkMl > 0 && (
          <div className="stat-item">
            <strong>{milkPerCupMl} ml</strong>
            <small>{recipe.cups > 1 ? "leche por taza" : "leche"}</small>
          </div>
        )}
        <div className="stat-item">
          <strong>1:{recipe.ratio}</strong>
          <small>proporción</small>
        </div>
        {recipe.methodId === "cold-brew" && <div className="stat-item">
          <strong>14 h</strong>
          <small>en refrigeración</small>
        </div>}
        {recipe.icedCoffeeMl > 0 && (
          <div className="stat-item">
            <strong>{recipe.icedCoffeeMl} ml</strong>
            <small>hielo sugerido</small>
          </div>
        )}
      </div>
      {recipe.methodId === "cold-brew" && <p className="dilution-note">{recipe.coldBrewMode === "concentrate" ? "Al servir: diluye cada parte de concentrado con una parte de agua." : "Receta lista para servir directamente sobre hielo."}</p>}

      <div className="recipe-meta">
        <p>
          <strong>Sirve:</strong> {recipe.cupSizeMl} ml por taza<br />
          <strong>Molienda:</strong> {recipe.grindSize}
          {recipe.methodId !== "cold-brew" && <><br />
          <strong>Temperatura:</strong> {recipe.temperatureC} °C
          </>}
          <br />
          <strong>{recipe.methodId === "cold-brew" ? "Infusión" : "Tiempo"}:</strong> {recipe.extractionTimeLabel}
        </p>
      </div>

      {!guided ? <button type="button" className="start-preparation" onClick={() => { setCurrentStep(0); onStart(); }}>Empezar preparación <span aria-hidden="true">→</span></button> : <div className="steps guided-steps">
        <h3>{recipe.methodId === "cold-brew" ? "Infusión en frío" : "Sigue los pasos"}</h3>
        <div className="step-controls" aria-label="Control de progreso de pasos">
          <span>{`Paso ${currentStep + 1} de ${recipe.steps.length}`}</span>
          <div className="step-buttons">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={prevDisabled}
              aria-label="Paso anterior"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentStep((prev) => Math.min(recipe.steps.length - 1, prev + 1))
              }
              disabled={nextDisabled}
              aria-label="Siguiente paso"
            >
              Siguiente →
            </button>
          </div>
        </div>
        <div className="timeline-track" aria-hidden="true">
          {timeline.map((item) => (
            <span
              key={`${recipe.methodId}-${item.index}`}
              className={
                item.isDone
                  ? "timeline-dot done"
                  : item.isActive
                    ? "timeline-dot active"
                    : "timeline-dot"
              }
            />
          ))}
        </div>
        {timeline.length === 0 ? (
          <p className="empty-note">No hay instrucciones para este método aún.</p>
        ) : (
          <>
            <div className="current-step-card" aria-live="polite">
              <small>Paso {currentStep + 1}</small>
              <p key={`${recipe.methodId}-${currentStep}`}>{timeline[currentStep].text}</p>
            </div>
            <details className="all-steps">
              <summary>Ver todos los pasos</summary>
              <ul className="timeline-list">
                {timeline.map((item) => (
                  <li key={`${recipe.methodId}-${item.index}`}>
                    <button
                      type="button"
                      className={`timeline-step ${item.isActive ? "active" : ""} ${item.isDone ? "done" : ""}`}
                      onClick={() => setCurrentStep(item.index)}
                      aria-pressed={item.isActive}
                    >
                      <p>
                        <strong>Paso {item.index + 1}</strong>
                      </p>
                      <span>{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </>
        )}
      </div>}
    </section>
  );
};
