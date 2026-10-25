import { useEffect, useMemo, useRef, useState } from "react";
import { BeverageType, BrewIntensity, BrewMethodId, RecipeInput } from "./domain/types";
import { calculateCoffeeRecipe } from "./services/recipeEngine";
import { addHistoryEntry, clearHistory, deleteFavorite, loadFavorites, loadHistory, saveFavorite } from "./services/recipeStorage";
import { beverageOptions, coffeeMethods, commonCupSizes } from "./data/coffeeMethods";
import { BeverageSelector } from "./components/BeverageSelector";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { IntensitySelector } from "./components/IntensitySelector";
import { MethodSelector } from "./components/MethodSelector";
import { QuantitySelector } from "./components/QuantitySelector";
import { RecipeResultCard } from "./components/RecipeResultCard";
import { CafeDrinkLibrary } from "./components/CafeDrinkLibrary";
import { DesignAlternatives } from "./components/DesignAlternatives";

type View = "prepare" | "recipes" | "saved";
const CoffeeBreakApp = () => {
  const [view, setView] = useState<View>("prepare");
  const [guided, setGuided] = useState(false);
  const [methodId, setMethodId] = useState<BrewMethodId>("cold-brew");
  const [intensity, setIntensity] = useState<BrewIntensity>("balanced");
  const [beverage, setBeverage] = useState<BeverageType>("black");
  const [coldBrewMode, setColdBrewMode] = useState<"concentrate" | "ready-to-drink">("concentrate");
  const [cups, setCups] = useState(2);
  const [cupSizeMl, setCupSizeMl] = useState(250);
  const [customSizeMl, setCustomSizeMl] = useState("250");
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [history, setHistory] = useState(() => loadHistory());
  const [saveMessage, setSaveMessage] = useState("");
  const [filter, setFilter] = useState("");
  const [libraryType, setLibraryType] = useState<"methods" | "drinks">("methods");
  const lastHistoryKeyRef = useRef("");

  const recipeInput: RecipeInput = useMemo(() => ({ methodId, intensity, beverage, cups, cupSizeMl, coldBrewMode }), [methodId, intensity, beverage, cups, cupSizeMl, coldBrewMode]);
  const recipe = useMemo(() => calculateCoffeeRecipe(recipeInput), [recipeInput]);
  const selectedMethod = coffeeMethods.find((method) => method.id === methodId);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const key = `${methodId}|${intensity}|${beverage}|${cups}|${cupSizeMl}|${coldBrewMode}`;
      if (lastHistoryKeyRef.current === key) return;
      setHistory((prev) => {
        const next = addHistoryEntry(prev, recipeInput, recipe);
        lastHistoryKeyRef.current = key;
        return next;
      });
    }, 550);
    return () => window.clearTimeout(timer);
  }, [recipeInput, recipe, methodId, intensity, beverage, cups, cupSizeMl, coldBrewMode]);

  const restoreInput = (input: RecipeInput) => {
    setMethodId(input.methodId); setIntensity(input.intensity); setBeverage(input.beverage);
    setCups(input.cups); setCupSizeMl(input.cupSizeMl); setCustomSizeMl(String(input.cupSizeMl));
    setIsCustomSize(!commonCupSizes.includes(input.cupSizeMl)); setColdBrewMode(input.coldBrewMode ?? "concentrate");
    setSaveMessage(""); setView("prepare"); setGuided(false);
  };
  const saveCurrent = () => {
    setFavorites(saveFavorite(favorites, recipeInput, recipe, `${recipe.methodName} · ${cups} × ${cupSizeMl} ml`));
    setSaveMessage("Guardada en este dispositivo"); window.setTimeout(() => setSaveMessage(""), 1800);
  };
  const filteredMethods = coffeeMethods.filter((method) => `${method.name} ${method.description}`.toLowerCase().includes(filter.toLowerCase()));

  return <div className={`app-shell ${guided && view === "prepare" ? "guided-mode" : ""}`}>
    <header className="topbar">
      <a className="brand" href="#preparar" onClick={(e) => { e.preventDefault(); setView("prepare"); }} aria-label="CoffeeBreak, preparar café">
        <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M8 15h22v10a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9V15Zm22 3h3a5 5 0 0 1 0 10h-5M15 10c-2-2 2-3 0-6m8 6c-2-2 2-3 0-6"/></svg></span>
        <span>CoffeeBreak</span>
      </a>
      <p className="top-note">Buen café,<br/>días más amables</p>
      <nav className="desktop-nav" aria-label="Navegación principal">
        {([["prepare", "Preparar"], ["recipes", "Recetario"], ["saved", "Guardadas"]] as [View, string][]).map(([id, label]) => <button key={id} className={view === id ? "nav-link active" : "nav-link"} onClick={() => setView(id)}>{label}</button>)}
      </nav>
    </header>

    <main className="main-content">
      {view === "prepare" && <>
        <section className="page-intro"><div><h1>Prepara tu café</h1><p>A tu gusto, con las cantidades listas.</p></div><span className="intro-note">Un mejor día<br/>empieza aquí</span></section>
        <div className="prepare-layout">
          <section className="calculator-panel" aria-label="Configura tu café">
            <MethodSelector methods={coffeeMethods} value={methodId} onChange={(value) => setMethodId(value)} />
            <div className={`cold-brew-reveal ${methodId === "cold-brew" ? "is-open" : ""}`} aria-hidden={methodId !== "cold-brew"}><div className="cold-brew-collapse"><section className="cold-brew-options">
              <div className="section-heading"><h2>Cold Brew</h2><span>Suave, dulce y refrescante</span></div>
              <div className="mode-switch" role="group" aria-label="Tipo de Cold Brew">
                <button tabIndex={methodId === "cold-brew" ? 0 : -1} className={coldBrewMode === "concentrate" ? "selected" : ""} onClick={() => setColdBrewMode("concentrate")}>Concentrado</button>
                <button tabIndex={methodId === "cold-brew" ? 0 : -1} className={coldBrewMode === "ready-to-drink" ? "selected" : ""} onClick={() => setColdBrewMode("ready-to-drink")}>Listo para tomar</button>
              </div>
              <p className="mode-hint">{coldBrewMode === "concentrate" ? "Se diluye 1:1 al servir. Ideal para guardar y preparar varias bebidas." : "Infusión equilibrada que puedes servir directamente con hielo."}</p>
            </section></div></div>
            <QuantitySelector cups={cups} setCups={setCups} cupSizeMl={cupSizeMl} setCupSizeMl={setCupSizeMl} customSizeMl={customSizeMl} setCustomSizeMl={(value) => { setCustomSizeMl(value); setIsCustomSize(true); }} isCustomSize={isCustomSize} setIsCustomSize={setIsCustomSize} />
            <div className="tuning-row"><IntensitySelector value={intensity} onChange={setIntensity}/><BeverageSelector value={beverage} onChange={setBeverage}/></div>
            <p className="recipe-caption"><span className="bean-icon" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M15.8 3.4C12.9.8 7.5 2.4 4.4 7s-2.8 9 .1 9.6 7.3-1 10.3-5.6 3.9-6 .9-7.6Z"/><path d="M5.1 15.8c1.8-3 4.9-6.3 9.8-10.1"/></svg></span> {selectedMethod?.description}</p>
          </section>
          <section className="result-panel" aria-label={guided ? "Guía de preparación" : "Tu receta calculada"}>
            <RecipeResultCard recipe={recipe} guided={guided} onStart={() => setGuided(true)} onBack={() => setGuided(false)}/>
            {!guided && <div className="save-row"><button type="button" className="save-button" onClick={saveCurrent}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"/></svg><span>Guardar receta</span></button><span role="status">{saveMessage}</span></div>}
          </section>
        </div>
      </>}

      {view === "recipes" && <section className="library-view"><div className="page-intro"><div><h1>Recetario</h1><p>Métodos y bebidas con cantidades para preparar.</p></div></div><div className="library-switch" role="group" aria-label="Tipo de receta"><button type="button" aria-pressed={libraryType === "methods"} className={libraryType === "methods" ? "active" : ""} onClick={() => setLibraryType("methods")}>Métodos de café</button><button type="button" aria-pressed={libraryType === "drinks"} className={libraryType === "drinks" ? "active" : ""} onClick={() => setLibraryType("drinks")}>Bebidas de cafetería <span>4</span></button></div>{libraryType === "methods" ? <><label className="search-label">Buscar método<input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Ej. Cold Brew" /></label><div className="library-list">{filteredMethods.map((method) => <article className="library-row" key={method.id}><div><h2>{method.name}</h2><p>{method.description}</p></div><button className="primary-btn" disabled={!method.implemented} onClick={() => (setMethodId(method.id), setView("prepare"))}>{method.implemented ? "Preparar →" : "Próximamente"}</button></article>)}</div></> : <CafeDrinkLibrary />}</section>}

      {view === "saved" && <section className="saved-view"><div className="page-intro"><div><h1>Tus recetas</h1><p>Guardadas e historial en este dispositivo.</p></div></div><FavoritesPanel favorites={favorites} onApply={restoreInput} onDelete={(id) => setFavorites((prev) => deleteFavorite(prev, id))}/><HistoryPanel history={history} onApply={restoreInput} onClear={() => setHistory(clearHistory())}/></section>}
    </main>

    <nav className="mobile-nav" aria-label="Navegación principal">
      {([["prepare", "Preparar"], ["recipes", "Recetario"], ["saved", "Guardadas"]] as [View, string][]).map(([id, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><span aria-hidden="true"><svg viewBox="0 0 24 24">{id === "prepare" ? <><path d="M4 11h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5Zm13 2h2a3 3 0 0 1 0 6h-3M8 8c-1-1 1-2 0-4m5 4c-1-1 1-2 0-4"/></> : id === "recipes" ? <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 0V22"/><path d="M8 7h8M8 11h8M8 15h6"/></> : <path d="M20.8 8.7c0 5.4-8.8 11-8.8 11s-8.8-5.6-8.8-11a4.7 4.7 0 0 1 8.8-2.2 4.7 4.7 0 0 1 8.8 2.2Z"/>}</svg></span>{label}</button>)}
      <p>Más café para buenos momentos</p>
    </nav>
  </div>;
};
const App = () => new URLSearchParams(window.location.search).get("propuestas") === "1"
  ? <DesignAlternatives />
  : <CoffeeBreakApp />;

export default App;
