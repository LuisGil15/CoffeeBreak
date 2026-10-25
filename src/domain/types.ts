export type BrewMethodId =
  | "chemex"
  | "v60"
  | "french-press"
  | "aeropress"
  | "moka"
  | "espresso"
  | "cold-brew";

export type ColdBrewMode = "concentrate" | "ready-to-drink";

export type BrewIntensity = "mild" | "balanced" | "intense";

export type BeverageType = "black" | "milk" | "cappuccino" | "iced";

export interface MethodIntensityProfile {
  ratio: number;
  grindSize: string;
  temperatureC: number;
  timeRangeSec: [number, number];
}

export interface MethodInstructionContext {
  totalDrinkMl: number;
  extractionWaterMl: number;
  milkMl: number;
  iceMl: number;
  coffeeGrams: number;
  ratio: number;
  grindSize: string;
  temperatureC: number;
  timeRangeSec: [number, number];
  methodName: string;
  intensity: BrewIntensity;
  beverage: BeverageType;
}

export interface CoffeeMethod {
  id: BrewMethodId;
  name: string;
  description: string;
  imageUrl?: string;
  ratioProfile: Record<BrewIntensity, MethodIntensityProfile>;
  supportsMilk: boolean;
  implemented: boolean;
  roastNotes?: string;
  params: Record<string, string | number | boolean>;
  instructions: (ctx: MethodInstructionContext) => string[];
}

export interface RecipeInput {
  methodId: BrewMethodId;
  intensity: BrewIntensity;
  beverage: BeverageType;
  cups: number;
  cupSizeMl: number;
  coldBrewMode?: ColdBrewMode;
}

export interface RecipeSnapshot {
  methodName: string;
  ratio: number;
  totalDrinkMl: number;
  extractionWaterMl: number;
  coffeeGrams: number;
  milkMl: number;
  icedCoffeeMl: number;
}

export interface SavedRecipeRef {
  id: string;
  label: string;
  input: RecipeInput;
  snapshot: RecipeSnapshot;
  createdAt: number;
}

export interface CoffeeRecipe {
  methodId: BrewMethodId;
  methodName: string;
  intensity: BrewIntensity;
  beverage: BeverageType;
  cups: number;
  cupSizeMl: number;
  totalDrinkMl: number;
  extractionWaterMl: number;
  coffeeGrams: number;
  ratio: number;
  milkMl: number;
  icedCoffeeMl: number;
  finalDrinkMl: number;
  temperatureC: number;
  grindSize: string;
  extractionTimeLabel: string;
  steps: string[];
  implemented: boolean;
  coldBrewMode?: ColdBrewMode;
}
