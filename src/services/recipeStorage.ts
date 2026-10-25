import {
  CoffeeRecipe,
  RecipeInput,
  SavedRecipeRef,
} from "../domain/types";

const FAVORITES_KEY = "coffeebreak:favorites";
const HISTORY_KEY = "coffeebreak:history";
const MAX_HISTORY = 30;

const safeStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    ? window.localStorage
    : null;

const readStorage = (key: string): SavedRecipeRef[] => {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedRecipeRef => {
      return (
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.label === "string" &&
        typeof item.createdAt === "number" &&
        item.input &&
        typeof item.input === "object"
      );
    });
  } catch {
    return [];
  }
};

const writeStorage = (key: string, value: SavedRecipeRef[]) => {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(key, JSON.stringify(value));
};

const snapshotFromRecipe = (recipe: CoffeeRecipe) => ({
  methodName: recipe.methodName,
  ratio: recipe.ratio,
  totalDrinkMl: recipe.totalDrinkMl,
  extractionWaterMl: recipe.extractionWaterMl,
  coffeeGrams: recipe.coffeeGrams,
  milkMl: recipe.milkMl,
  icedCoffeeMl: recipe.icedCoffeeMl,
});

const sameInput = (
  a: RecipeInput,
  b: RecipeInput,
): boolean =>
  a.methodId === b.methodId &&
  a.intensity === b.intensity &&
  a.beverage === b.beverage &&
  a.cups === b.cups &&
  a.cupSizeMl === b.cupSizeMl &&
  (a.coldBrewMode ?? "concentrate") === (b.coldBrewMode ?? "concentrate");

const sameRecipeSnapshot = (
  a: SavedRecipeRef["snapshot"],
  b: SavedRecipeRef["snapshot"],
): boolean =>
  a.totalDrinkMl === b.totalDrinkMl &&
  a.extractionWaterMl === b.extractionWaterMl &&
  a.coffeeGrams === b.coffeeGrams &&
  a.milkMl === b.milkMl &&
  a.icedCoffeeMl === b.icedCoffeeMl &&
  a.ratio === b.ratio &&
  a.methodName === b.methodName;

export const loadFavorites = (): SavedRecipeRef[] => readStorage(FAVORITES_KEY);
export const loadHistory = (): SavedRecipeRef[] => readStorage(HISTORY_KEY);

export const saveFavorite = (
  favorites: SavedRecipeRef[],
  input: RecipeInput,
  recipe: CoffeeRecipe,
  label: string,
): SavedRecipeRef[] => {
  const next: SavedRecipeRef = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label,
    input,
    snapshot: snapshotFromRecipe(recipe),
    createdAt: Date.now(),
  };
  const unique = [next, ...favorites].filter((entry, index, all) => {
    return (
      index ===
      all.findIndex(
        (candidate) =>
          sameInput(candidate.input, entry.input) &&
          sameRecipeSnapshot(candidate.snapshot, entry.snapshot),
      )
    );
  });
  const nextFavorites = unique.slice(0, 24);
  writeStorage(FAVORITES_KEY, nextFavorites);
  return nextFavorites;
};

export const deleteFavorite = (favorites: SavedRecipeRef[], id: string): SavedRecipeRef[] => {
  const nextFavorites = favorites.filter((favorite) => favorite.id !== id);
  writeStorage(FAVORITES_KEY, nextFavorites);
  return nextFavorites;
};

export const addHistoryEntry = (
  history: SavedRecipeRef[],
  input: RecipeInput,
  recipe: CoffeeRecipe,
): SavedRecipeRef[] => {
  const nextEntry: SavedRecipeRef = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label: `${recipe.methodName} · ${input.cups} × ${input.cupSizeMl} ml`,
    input,
    snapshot: snapshotFromRecipe(recipe),
    createdAt: Date.now(),
  };
  const next = [nextEntry, ...history].filter((entry, index, all) => {
    return (
      index ===
      all.findIndex((candidate) => sameInput(candidate.input, entry.input))
    );
  });
  const nextHistory = next.slice(0, MAX_HISTORY);
  writeStorage(HISTORY_KEY, nextHistory);
  return nextHistory;
};

export const clearHistory = (): SavedRecipeRef[] => {
  const storage = safeStorage();
  if (storage) storage.removeItem(HISTORY_KEY);
  return [];
};
