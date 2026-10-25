export interface CafeDrinkRecipe {
  id: string;
  name: string;
  summary: string;
  style: "coffee" | "tea";
  baseIngredients: string[];
  source: { label: string; url: string };
  steps: string[];
  cupLayers: string[];
}

export const cafeDrinkRecipes: CafeDrinkRecipe[] = [
  {
    id: "cappuccino",
    name: "Capuchino",
    summary: "Espresso, leche caliente y una capa generosa de espuma.",
    style: "coffee",
    baseIngredients: ["1 espresso (40 ml)", "Leche fría (100 ml)", "Canela o cacao, opcional"],
    source: { label: "Nespresso · Cappuccino", url: "https://www.nespresso.com/pro/nz/en/recipes/origins/cappuccino-recipe" },
    steps: [
      "Prepara 40 ml de espresso en una taza para capuchino.",
      "Calienta y espuma 100 ml de leche. Si no tienes espumador, bate la leche caliente hasta que quede aireada.",
      "Vierte primero la leche caliente sobre el espresso y termina con la espuma encima.",
      "Añade canela o cacao si te gusta. La taza debe quedar cremosa, con espuma visible.",
    ],
    cupLayers: ["Espuma", "Leche", "Espresso"],
  },
  {
    id: "latte",
    name: "Latte",
    summary: "Un espresso suave con leche texturizada y poca espuma.",
    style: "coffee",
    baseIngredients: ["1 espresso (40 ml)", "Leche (80 ml)"],
    source: { label: "Nespresso · Latte Heart", url: "https://www.nespresso.com/recipes/us/en/19787LAT-latte-heart-by-nespresso.html" },
    steps: [
      "Prepara 40 ml de espresso en una taza amplia.",
      "Calienta y espuma 80 ml de leche hasta que quede sedosa; busca microespuma fina, no espuma seca.",
      "Vierte la leche despacio sobre el espresso. Si quieres, termina con un dibujo sencillo.",
    ],
    cupLayers: ["Leche sedosa", "Espresso"],
  },
  {
    id: "mocha",
    name: "Moka de chocolate",
    summary: "La mezcla de espresso, chocolate y leche espumada.",
    style: "coffee",
    baseIngredients: ["1 espresso (40 ml)", "Chocolate oscuro (20 g)", "Leche fría (100 ml)", "Canela, opcional"],
    source: { label: "Nespresso · Mocha", url: "https://www.nespresso.com/recipes/sg/en/23093MOC-mocha.html" },
    steps: [
      "Coloca 20 g de chocolate oscuro picado en una taza resistente al calor.",
      "Prepara 40 ml de espresso y viértelo sobre el chocolate; mezcla hasta disolver.",
      "Calienta y espuma 100 ml de leche, luego incorpórala al café con chocolate.",
      "Termina con una pizca de canela si quieres.",
    ],
    cupLayers: ["Espuma de leche", "Leche", "Chocolate", "Espresso"],
  },
  {
    id: "chai-latte",
    name: "Chai latte",
    summary: "Té negro con especias y leche espumada; no lleva café.",
    style: "tea",
    baseIngredients: ["2 bolsitas de té chai", "Agua caliente (60 ml)", "Leche (180 ml)", "Miel o azúcar, al gusto"],
    source: { label: "The Coffee Bean & Tea Leaf · Chai Latte", url: "https://www.coffeebean.com/blogs/blog/how-to-make-a-chai-latte" },
    steps: [
      "Infusiona 2 bolsitas de chai en 60 ml de agua caliente, siguiendo el tiempo indicado en el empaque.",
      "Calienta 180 ml de leche y espúmala ligeramente. También puedes usar leche de avena.",
      "Retira las bolsitas, vierte la leche sobre el chai y endulza al gusto.",
      "Termina con canela o nuez moscada. Para servirlo frío, usa leche fría y hielo.",
    ],
    cupLayers: ["Espuma", "Leche", "Chai especiado"],
  },
];
