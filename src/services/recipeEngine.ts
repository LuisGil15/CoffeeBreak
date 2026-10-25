import {
  beverageProfiles,
  getMethodTitle,
  methodById,
  getQuantityAdjustedRatio,
} from "../data/coffeeMethods";
import {
  BrewIntensity,
  CoffeeMethod,
  CoffeeRecipe,
  RecipeInput,
  RecipeInput as RecipeInputAlias,
} from "../domain/types";

type EnsureRecipeInput = RecipeInputAlias;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const toDisplayRatio = (ratio: number): number => Math.round(ratio * 10) / 10;

const formatTimeLabel = (range: [number, number]): string =>
  range[0] === range[1]
    ? `${range[0]} s`
    : `${range[0]}–${range[1]} s`;

const getAdjustedTime = (method: CoffeeMethod, intensity: BrewIntensity): [number, number] =>
  method.ratioProfile[intensity].timeRangeSec;

const roundOneDecimal = (value: number): number =>
  Math.round(value * 10) / 10;

export const calculateCoffeeRecipe = (input: EnsureRecipeInput): CoffeeRecipe => {
  const method = methodById(input.methodId);
  const totalDrinkMl = clamp(input.cups, 1, 12) * input.cupSizeMl;
  const beverage = beverageProfiles[input.beverage];
  const coldBrewMode = input.coldBrewMode ?? "concentrate";

  const ratio = input.methodId === "cold-brew"
    ? coldBrewMode === "concentrate"
      ? method.ratioProfile[input.intensity].ratio
      : ({ mild: 18, balanced: 15, intense: 13 } as const)[input.intensity]
    : getQuantityAdjustedRatio(
    method,
    input.intensity,
    totalDrinkMl,
    input.beverage,
  );
  const extractionWaterMl = Math.max(
    0,
    Math.round(totalDrinkMl * (input.methodId === "cold-brew"
      ? (coldBrewMode === "concentrate" ? 0.5 : 1) * (1 - beverage.milkRatio) * (1 - beverage.icedAddition)
      : beverage.extractionShare)),
  );
  const milkMl = Math.round(totalDrinkMl * beverage.milkRatio);
  const icedCoffeeMl = Math.round(totalDrinkMl * beverage.icedAddition);
  const finalDrinkMl = Math.max(totalDrinkMl, extractionWaterMl + milkMl);

  const coffeeGrams = roundOneDecimal(extractionWaterMl / ratio);
  const finalCoffee = toDisplayRatio(ratio);

  const intensityProfile = method.ratioProfile[input.intensity];
  const steps = method.instructions({
    totalDrinkMl,
    extractionWaterMl,
    milkMl,
    iceMl: icedCoffeeMl,
    coffeeGrams,
    ratio: finalCoffee,
    grindSize: intensityProfile.grindSize,
    temperatureC: intensityProfile.temperatureC,
    timeRangeSec: getAdjustedTime(method, input.intensity),
    methodName: method.name,
    intensity: input.intensity,
    beverage: input.beverage,
  });
  if (input.methodId === "cold-brew") {
    steps[4] = coldBrewMode === "concentrate"
      ? "Sirve sobre hielo y diluye el concentrado en proporción 1:1 con agua."
      : "Sirve directamente sobre hielo; esta receta ya está lista para tomar.";
  }

  const extractionTimeLabel = input.methodId === "cold-brew" ? "14 h en refrigeración" : formatTimeLabel(
    getAdjustedTime(method, input.intensity),
  );

  return {
    methodId: method.id,
    methodName: getMethodTitle(method.name, input.beverage),
    intensity: input.intensity,
    beverage: input.beverage,
    cups: clamp(input.cups, 1, 12),
    cupSizeMl: input.cupSizeMl,
    totalDrinkMl: Math.round(totalDrinkMl),
    extractionWaterMl,
    coffeeGrams,
    ratio: finalCoffee,
    milkMl,
    icedCoffeeMl,
    finalDrinkMl,
    temperatureC: intensityProfile.temperatureC,
    grindSize: intensityProfile.grindSize,
    extractionTimeLabel,
    steps,
    implemented: method.implemented,
    coldBrewMode: input.methodId === "cold-brew" ? coldBrewMode : undefined,
  };
};
