import {
  BeverageType,
  BrewIntensity,
  CoffeeMethod,
  MethodInstructionContext,
  BrewMethodId,
} from "../domain/types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const toInt = (value: number): number => Math.round(value);

const roundHalf = (value: number): number => Math.round(value * 10) / 10;

const formatMl = (ml: number): string => `${Math.round(ml)} ml`;

const formatCommonRange = (label: string) => label;

const toRangeLabel = (range: [number, number]): string => {
  if (range[0] === range[1]) return `${range[0]} s`;
  return `${range[0]}–${range[1]} s`;
};

const chemexInstructions = (ctx: MethodInstructionContext): string[] => {
  const bloomMl = toInt(clamp(ctx.extractionWaterMl * 0.12, 55, 90));
  const middleMl = toInt(clamp(ctx.extractionWaterMl * 0.42, 120, 300));
  const finishMl = toInt(ctx.extractionWaterMl - bloomMl - middleMl);
  const coffeeDose = roundHalf(ctx.coffeeGrams);

  return [
    "Enjuaga el filtro con agua caliente y tira ese agua, para estabilizar temperatura y eliminar sabores.",
    `Coloca ${coffeeDose} g de café molido medio-fino en el filtro y nivélalo suavemente.`,
    `Añade ${formatMl(bloomMl)} para el bloom (aprox. ${toRangeLabel([30, 40])}) y espera sin tocar.`,
    `Vierte ${formatMl(middleMl)} en movimientos circulares lentos y continuos.`,
    `Añade el resto (${formatMl(finishMl)}) manteniendo el nivel del agua entre ¾ y ⅔ del embudo.`,
    `Termina el goteo hasta llegar a ${formatMl(ctx.extractionWaterMl)} total.`,
    "Retira el dripper y deja reposar 20–30 segundos para estabilizar la bebida."
  ];
};

const frenchPressInstructions = (ctx: MethodInstructionContext): string[] => {
  const firstPourMl = toInt(ctx.extractionWaterMl * 0.7);
  const secondPourMl = toInt(ctx.extractionWaterMl - firstPourMl);
  const coffeeDose = roundHalf(ctx.coffeeGrams);
  return [
    "Coloca el émbolo con el filtro hacia arriba y añade el café molido grueso.",
    `Vierte ${formatMl(firstPourMl)} y remueve suavemente por 10 segundos para humedecer todo el café.`,
    `Añade ${formatMl(secondPourMl)} y cubre con tapa.`,
    "Deja reposar 4 minutos. Si quieres más cuerpo, extiende hasta 4:30 en intensidad alta.",
    "Baja el émbolo de forma uniforme (no presionar con fuerza excesiva).",
    `Sirve inmediatamente para evitar sobreextracción.`
  ].map((step) =>
    step.replace(
      "4 minutos",
      `${coffeeDose} g · 2-${ctx.intensity === "intense" ? 5 : 4} min`,
    ),
  );
};

const genericPourOverInstructions = (ctx: MethodInstructionContext): string[] => [
  `Usa ${formatMl(ctx.extractionWaterMl)} de agua caliente a ${ctx.temperatureC} °C.`,
  `Añade ${roundHalf(ctx.coffeeGrams)} g de café y vierte en movimientos circulares de 3 fases.`,
  "Primera fase de bloom (30–40 segundos).",
  "Completa el vertido en 2 rondas hasta alcanzar la cantidad exacta.",
  "Retira el filtro y sirve.",
];

const v60Instructions = (ctx: MethodInstructionContext): string[] => {
  const bloomMl = toInt(clamp(ctx.extractionWaterMl * 0.13, 50, 85));
  const firstPourMl = toInt(ctx.extractionWaterMl * 0.45);
  const secondPourMl = toInt((ctx.extractionWaterMl - bloomMl - firstPourMl) * 0.55);
  const lastPourMl = toInt(ctx.extractionWaterMl - bloomMl - firstPourMl - secondPourMl);

  return [
    "Enjuaga el filtro dentro del dripper para estabilizar temperatura y quitar sabor.",
    `Coloca ${roundHalf(ctx.coffeeGrams)} g de café y nivélalo`,
    `Bloom: vierte ${formatMl(bloomMl)} de agua y espera 35 segundos.`,
    `Vierte ${formatMl(firstPourMl)} en espiral y sube el flujo sin tocar el centro.`,
    `Añade ${formatMl(secondPourMl)} y busca mantener un borde de agua estable.`,
    `Añade el remanente ${formatMl(lastPourMl)} y deja caer sin prisa.`,
    `Llega justo al total de ${formatMl(ctx.extractionWaterMl)} y limpia el borde del embudo.`,
  ];
};

const espressoInstructions = (ctx: MethodInstructionContext): string[] => [
  `Tamping uniforme con fuerza constante y distribución homogénea.`,
  `Usa agua a ${ctx.temperatureC} °C y busca un tiempo entre ${toRangeLabel(ctx.timeRangeSec)}.`,
  `Extrae ${formatMl(ctx.extractionWaterMl)} de bebida espesa y brillante.`,
  "Sirve inmediatamente para conservar aroma y cuerpo.",
];

const mokaInstructions = (ctx: MethodInstructionContext): string[] => [
  "Limpia el filtro y llena la parte inferior con agua sin sobrepasar la válvula.",
  `Coloca ${roundHalf(ctx.coffeeGrams)} g de café de molienda fina-media y nivélalo.`,
  "Ensambla la cafetera y coloca a fuego medio-bajo para evitar sobrecalentamiento.",
  "Cuando empiece a salir una hilera fina, baja el fuego y espera a extraer justo antes de que suene enérgicamente.",
  "Retira del fuego y mezcla para evitar sabores metálicos.",
];

const aeropressInstructions = (ctx: MethodInstructionContext): string[] => [
  "Inserta el filtro en la tapa y enjuaga con agua caliente.",
  `Añade ${roundHalf(ctx.coffeeGrams)} g de café molido medio-fino y haz una prehumectación con 1/3 de agua.`,
  "Revuelve 10 segundos para eliminar grumos y deja reposar 1 minuto.",
  "Añade el resto de agua, vuelve a remover 8 segundos y baja la cámara en reversa.",
  `Aplica presión en 5 fases suaves durante ${toRangeLabel(ctx.timeRangeSec)}.`,
  "Separa el agua de abajo si quieres más limpio o deja más cuerpo según gusto."
];

const recipeTypeSuffix = (beverage: BeverageType): string => {
  switch (beverage) {
    case "milk":
      return " (con leche)";
    case "cappuccino":
      return " (cappuccino)";
    case "iced":
      return " (iced)";
    default:
      return "";
  }
};

export const coffeeMethods: CoffeeMethod[] = [
  {
    id: "chemex",
    name: "Chemex",
    description: "Extracción limpia, brillante y aromática",
    imageUrl: "/images/chemex-card.jpg",
    ratioProfile: {
      mild: {
        ratio: 18.2,
        grindSize: "media-gruesa (5)",
        temperatureC: 95,
        timeRangeSec: [190, 220],
      },
      balanced: {
        ratio: 16.8,
        grindSize: "media-gruesa (4)",
        temperatureC: 94,
        timeRangeSec: [190, 215],
      },
      intense: {
        ratio: 15.6,
        grindSize: "media (3)",
        temperatureC: 93,
        timeRangeSec: [210, 240],
      },
    },
    supportsMilk: true,
    implemented: true,
    roastNotes: "Resalta acidez limpia en granos suaves y cítricos suaves.",
    params: {
      brewMethod: "pour-over",
      filterType: "papel",
      prefilter: true,
      blooming: true,
      maxRecommendedMl: 1200,
    },
    instructions: chemexInstructions,
  },
  {
    id: "v60",
    name: "V60",
    description: "Filtro tradicional con control total del flujo",
    imageUrl: "/images/v60-card.jpg",
    ratioProfile: {
      mild: {
        ratio: 17.8,
        grindSize: "media-gruesa",
        temperatureC: 94,
        timeRangeSec: [170, 210],
      },
      balanced: {
        ratio: 16.4,
        grindSize: "media",
        temperatureC: 94,
        timeRangeSec: [175, 205],
      },
      intense: {
        ratio: 15.2,
        grindSize: "media (4)",
        temperatureC: 93,
        timeRangeSec: [185, 215],
      },
    },
    supportsMilk: true,
    implemented: true,
    params: {
      brewMethod: "pour-over",
      filterType: "papel",
      bloom: true,
      maxRecommendedMl: 950,
    },
    instructions: v60Instructions,
  },
  {
    id: "french-press",
    name: "French Press",
    description: "Sabor redondo con cuerpo y alta aceitosidad",
    imageUrl: "/images/french-press-card.jpg",
    ratioProfile: {
      mild: {
        ratio: 18.8,
        grindSize: "gruesa",
        temperatureC: 96,
        timeRangeSec: [230, 270],
      },
      balanced: {
        ratio: 16.7,
        grindSize: "gruesa",
        temperatureC: 95,
        timeRangeSec: [240, 280],
      },
      intense: {
        ratio: 15.5,
        grindSize: "gruesa-regular",
        temperatureC: 94,
        timeRangeSec: [255, 300],
      },
    },
    supportsMilk: true,
    implemented: true,
    roastNotes: "Ideal para perfiles dulces con cuerpo medio-largo.",
    params: {
      brewMethod: "immersion",
      steepMinutes: 4,
      pressureType: "manual",
    },
    instructions: frenchPressInstructions,
  },
  {
    id: "aeropress",
    name: "AeroPress",
    description: "Versátil, limpia y muy rápida",
    imageUrl: "/images/aeropress-card.jpg",
    ratioProfile: {
      mild: {
        ratio: 14.8,
        grindSize: "media-fina",
        temperatureC: 93,
        timeRangeSec: [75, 110],
      },
      balanced: {
        ratio: 13.2,
        grindSize: "media",
        temperatureC: 93,
        timeRangeSec: [60, 95],
      },
      intense: {
        ratio: 12,
        grindSize: "media-gruesa",
        temperatureC: 92,
        timeRangeSec: [55, 85],
      },
    },
    supportsMilk: true,
      implemented: true,
    params: {
      brewMethod: "hybrid",
      pressingMethod: "manual pressure",
      plastic: true,
    },
    instructions: aeropressInstructions,
  },
  {
    id: "moka",
    name: "Moka",
    description: "Tueste intenso y extracción robusta",
    imageUrl: "/images/moka-card.jpg",
    ratioProfile: {
      mild: {
        ratio: 11,
        grindSize: "fina-media",
        temperatureC: 96,
        timeRangeSec: [140, 190],
      },
      balanced: {
        ratio: 10.2,
        grindSize: "media-fina",
        temperatureC: 97,
        timeRangeSec: [130, 175],
      },
      intense: {
        ratio: 9.5,
        grindSize: "fina",
        temperatureC: 98,
        timeRangeSec: [120, 165],
      },
    },
    supportsMilk: true,
    implemented: false,
    params: {
      brewMethod: "pressure-pot",
      maxRecommendedMl: 300,
      stove: true,
    },
    instructions: mokaInstructions,
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Concentrado, corto y limpio",
    imageUrl: "/images/espresso-card.jpg",
    ratioProfile: {
      mild: {
        ratio: 2.4,
        grindSize: "muy fina",
        temperatureC: 93,
        timeRangeSec: [24, 30],
      },
      balanced: {
        ratio: 2.1,
        grindSize: "muy fina",
        temperatureC: 92,
        timeRangeSec: [22, 28],
      },
      intense: {
        ratio: 1.9,
        grindSize: "extra fina",
        temperatureC: 92,
        timeRangeSec: [20, 26],
      },
    },
    supportsMilk: true,
    implemented: false,
    params: {
      brewMethod: "pump",
      pressure: "9 bar",
      preinfusion: true,
    },
    instructions: espressoInstructions,
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Infusión fría, dulce y lista para preparar con anticipación",
    imageUrl: "/images/cold-brew-card.jpg",
    ratioProfile: {
      mild: { ratio: 9, grindSize: "gruesa", temperatureC: 20, timeRangeSec: [0, 0] },
      balanced: { ratio: 8, grindSize: "gruesa", temperatureC: 20, timeRangeSec: [0, 0] },
      intense: { ratio: 7, grindSize: "gruesa", temperatureC: 20, timeRangeSec: [0, 0] },
    },
    supportsMilk: true,
    implemented: true,
    params: { brewMethod: "cold-immersion", steepHours: 14 },
    instructions: (ctx) => [
      `Muele ${roundHalf(ctx.coffeeGrams)} g de café en molienda gruesa.`,
      `Añade ${formatMl(ctx.extractionWaterMl)} de agua fría y mezcla para mojar todo el café.`,
      "Tapa y deja infusionar en refrigeración durante 14 horas.",
      "Filtra lentamente para separar el café molido.",
      "Sirve con hielo. Si preparaste concentrado, diluye cada parte de concentrado con una parte de agua.",
    ],
  },
];

export const intensityOptions: { value: BrewIntensity; label: string; description: string }[] =
  [
    { value: "mild", label: "Suave", description: "Más limpio y suave" },
    {
      value: "balanced",
      label: "Balanceado",
      description: "Equilibrio entre cuerpo y acidez",
    },
    { value: "intense", label: "Intenso", description: "Mayor cuerpo y presencia" },
  ];

export const beverageOptions: {
  value: BeverageType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: "black",
    icon: "☕",
    label: "Café negro",
    description: "Sin leche",
  },
  {
    value: "milk",
    icon: "🍼",
    label: "Con leche",
    description: "Leche suave",
  },
  {
    value: "cappuccino",
    icon: "☕",
    label: "Cappuccino",
    description: "Leche espumada",
  },
  {
    value: "iced",
    icon: "🧊",
    label: "Iced",
    description: "Frío",
  },
];

export const commonCupSizes = [150, 200, 250, 300, 350];

export const beverageProfiles: Record<
  BeverageType,
  {
    extractionShare: number;
    milkRatio: number;
    icedAddition: number;
    ratioShift: number;
  }
> = {
  black: { extractionShare: 1, milkRatio: 0, icedAddition: 0, ratioShift: 0 },
  milk: { extractionShare: 0.75, milkRatio: 0.25, icedAddition: 0, ratioShift: -0.55 },
  cappuccino: {
    extractionShare: 0.68,
    milkRatio: 0.32,
    icedAddition: 0,
    ratioShift: -0.75,
  },
  iced: { extractionShare: 0.82, milkRatio: 0, icedAddition: 0.2, ratioShift: 0.42 },
};

export const methodById = (id: BrewMethodId): CoffeeMethod =>
  coffeeMethods.find((method) => method.id === id) || coffeeMethods[0];

export const getMethodTitle = (method: string, beverage: BeverageType): string =>
  `${method}${recipeTypeSuffix(beverage)}`;

export const getQuantityAdjustedRatio = (
  method: CoffeeMethod,
  intensity: BrewIntensity,
  totalDrinkMl: number,
  beverage: BeverageType,
): number => {
  const base = method.ratioProfile[intensity].ratio;
  const amountShift = totalDrinkMl <= 300 ? 0.35 : totalDrinkMl <= 500 ? 0 : -0.25;
  const heavyShift = totalDrinkMl >= 900 ? -0.25 : 0;
  const beverageShift = beverageProfiles[beverage].ratioShift;
  return roundHalf(base + amountShift + heavyShift + beverageShift);
};
