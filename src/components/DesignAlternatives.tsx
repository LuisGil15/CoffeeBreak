import { useState } from "react";

const directions = [
  { id: "barista", title: "Barra de barista", note: "Ajusta y calcula" },
  { id: "recetario", title: "Recetario de barra", note: "Explora y prepara" },
  { id: "preparacion", title: "Café en preparación", note: "Sigue el proceso" },
] as const;

const drinkOptions = [
  { name: "Cappuccino", description: "Espresso corto, leche y espuma", ingredients: ["18 g café", "36 ml espresso", "120 ml leche"], layers: ["milk", "coffee", "foam"], steps: ["Prepara un espresso doble.", "Texturiza la leche hasta lograr microespuma.", "Vierte la leche y termina con espuma suave."] },
  { name: "Latte", description: "Espresso y leche sedosa", ingredients: ["18 g café", "36 ml espresso", "180 ml leche"], layers: ["milk", "coffee", "foam"], steps: ["Prepara un espresso doble.", "Calienta la leche hasta que quede sedosa.", "Vierte la leche lentamente sobre el espresso."] },
  { name: "Moka", description: "Chocolate, espresso y leche", ingredients: ["18 g café", "20 g chocolate", "150 ml leche"], layers: ["milk", "chocolate", "coffee"], steps: ["Disuelve el chocolate en la taza.", "Prepara un espresso doble.", "Añade leche caliente y mezcla."] },
] as const;

const coldBrewSteps = [
  "Pesa 30 g de café con molienda gruesa.",
  "Añade 240 ml de agua fría y mezcla suavemente.",
  "Tapa y deja infusionar 14 horas en refrigeración.",
  "Filtra. Sirve con hielo y diluye 1:1 si preparaste concentrado.",
];

const BaristaDemo = () => {
  const [method, setMethod] = useState("V60");
  const [cups, setCups] = useState(2);
  const water = cups * 250;
  const coffee = Math.round(water / (method === "Chemex" ? 15 : 16));
  return <div className="prototype barista-demo">
    <div className="prototype-topline"><span>Tu estación</span><span>Receta en vivo</span></div>
    <h3>Prepara tu café</h3>
    <p className="prototype-copy">Elige método y cantidad. La receta se ajusta al momento.</p>
    <div className="demo-methods" role="group" aria-label="Método de preparación">
      {["V60", "Chemex", "Prensa"].map((item) => <button key={item} className={method === item ? "is-selected" : ""} onClick={() => setMethod(item)}>{item}</button>)}
    </div>
    <div className="demo-quantity"><span>Porciones</span><div><button aria-label="Quitar una porción" onClick={() => setCups(Math.max(1, cups - 1))}>−</button><strong>{cups}</strong><button aria-label="Agregar una porción" onClick={() => setCups(Math.min(8, cups + 1))}>+</button></div></div>
    <div className="demo-recipe-line"><span><strong>{coffee} g</strong><small>café</small></span><span className="demo-ratio">1:{method === "Chemex" ? "15" : "16"}</span><span><strong>{water} ml</strong><small>agua</small></span></div>
    <div className="demo-footnote">Molienda media · Agua a 94 °C</div>
  </div>;
};

const RecipeDemo = () => {
  const [drinkIndex, setDrinkIndex] = useState(0);
  const [step, setStep] = useState(0);
  const drink = drinkOptions[drinkIndex];
  return <div className="prototype recipe-demo">
    <div className="prototype-topline"><span>De la barra a tu casa</span><span>3 recetas</span></div>
    <h3>¿Qué se te antoja?</h3>
    <div className="demo-drink-list" role="group" aria-label="Bebidas de cafetería">
      {drinkOptions.map((item, index) => <button key={item.name} className={drinkIndex === index ? "is-selected" : ""} onClick={() => { setDrinkIndex(index); setStep(0); }}><strong>{item.name}</strong><small>{item.description}</small></button>)}
    </div>
    <div className="demo-drink-detail">
      <div className="demo-drink-title"><div><span>Receta de cafetería</span><h4>{drink.name}</h4></div><div className="demo-cup" aria-label={`Capas de ${drink.name}`}>
        {drink.layers.map((layer, i) => <span key={`${layer}-${i}`} className={`cup-layer ${layer}`} style={{ height: `${100 / drink.layers.length}%` }} />)}
      </div></div>
      <div className="demo-ingredients">{drink.ingredients.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="demo-step"><span>Paso {step + 1} de {drink.steps.length}</span><p key={`${drink.name}-${step}`}>{drink.steps[step]}</p></div>
      <div className="demo-step-actions"><button disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Anterior</button><button className="demo-primary" onClick={() => setStep((step + 1) % drink.steps.length)}>{step === drink.steps.length - 1 ? "Repetir" : "Siguiente"}</button></div>
    </div>
  </div>;
};

const ProcessDemo = () => {
  const [step, setStep] = useState(0);
  return <div className="prototype process-demo">
    <div className="prototype-topline"><span>Cold Brew · Concentrado</span><span>Sin cronómetro</span></div>
    <h3>Una preparación tranquila</h3>
    <p className="prototype-copy">Pasos claros, cantidades a la vista y el tiempo de infusión indicado.</p>
    <div className="process-cup" aria-hidden="true"><span className="process-liquid" style={{ height: `${36 + step * 14}%` }} /><span className="process-cup-mark">COLD<br/>BREW</span></div>
    <div className="process-measure"><strong>{step === 2 ? "14 h" : "30 g"}</strong><span>{step === 2 ? "en refrigeración" : "café de molienda gruesa"}</span></div>
    <div className="process-progress" aria-label={`Paso ${step + 1} de ${coldBrewSteps.length}`}>{coldBrewSteps.map((_, index) => <span key={index} className={index <= step ? "done" : ""} />)}</div>
    <p className="process-instruction" key={step}>{coldBrewSteps[step]}</p>
    <div className="demo-step-actions"><button disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Anterior</button><button className="demo-primary" onClick={() => setStep((step + 1) % coldBrewSteps.length)}>{step === coldBrewSteps.length - 1 ? "Volver al inicio" : "Siguiente paso"}</button></div>
    <div className="process-recipe-footer"><span>30 g café</span><span>240 ml agua</span><span>1:8</span></div>
  </div>;
};

export const DesignAlternatives = () => {
  const [selected, setSelected] = useState(0);
  return <main className="alternatives-page">
    <header className="alternatives-header"><a href="/" className="alternatives-brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M8 15h22v10a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9V15Zm22 3h3a5 5 0 0 1 0 10h-5M15 10c-2-2 2-3 0-6m8 6c-2-2 2-3 0-6"/></svg></span>CoffeeBreak <small>propuestas interactivas</small></a><a className="return-link" href="/">Volver a la herramienta</a></header>
    <section className="alternatives-intro"><p>Un mismo recetario, tres maneras de usarlo.</p><h1>¿Cómo quieres preparar tu próximo café?</h1><span>Toca una propuesta para verla en móvil. En escritorio puedes compararlas en paralelo.</span></section>
    <nav className="alternatives-tabs" aria-label="Propuestas de diseño">{directions.map((item, index) => <button key={item.id} className={selected === index ? "active" : ""} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.note}</small></button>)}</nav>
    <section className="alternatives-grid">{directions.map((item, index) => <article key={item.id} className={`alternative-option ${selected === index ? "active" : ""}`}>
      <header className="alternative-heading"><div><span>Propuesta 0{index + 1}</span><h2>{item.title}</h2></div><p>{index === 0 ? "La herramienta se siente como una barra compacta: ajustes a la izquierda, resultado listo al instante." : index === 1 ? "Las bebidas se descubren como en la carta de una cafetería; cada receta conserva pasos medidos." : "La preparación guía la mirada paso a paso, con una taza que muestra el avance sin temporizador."}</p></header>
      {index === 0 ? <BaristaDemo/> : index === 1 ? <RecipeDemo/> : <ProcessDemo/>}
      <button className="choose-direction" onClick={() => setSelected(index)} aria-pressed={selected === index}>{selected === index ? "Estás viendo esta propuesta" : "Ver esta propuesta"}</button>
    </article>)}</section>
    <footer className="alternatives-footer">Estas son muestras funcionales. Tus recetas guardadas y la herramienta principal no cambian al probarlas.</footer>
  </main>;
};
