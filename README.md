# CoffeeBreak

CoffeeBreak es una calculadora y recetario de café pensada para móvil, construida con React + TypeScript.

## Estructura principal

- `src/domain/types.ts` → contratos de tipos (`CoffeeMethod`, `CoffeeRecipe`, `RecipeInput`, etc.)
- `src/data/coffeeMethods.ts` → catálogo de métodos, ratios por intensidad y parámetros.
- `src/services/recipeEngine.ts` → motor de cálculo (sin dependencia de UI).
- `src/services/recipeStorage.ts` → persistencia local de favoritos e historial.
- `src/components/*` → tarjetas de configuración y tarjetas de resultado.
- `src/styles.css` → visual mobile-first.

## Estado actual (MVP)

- Métodos listados y seleccionables:
  - Chemex ✅
  - V60 ✅
  - French Press ✅
  - AeroPress ✅
  - Moka ⏳
  - Espresso ⏳
- Características activas:
  - Filtro por intensidad y tipo de bebida
  - Cálculo de café, agua de extracción, leche/hielo y ratio
  - Instrucciones adaptadas al método
  - Guardado de favoritos
  - Historial de ajustes
  - Timeline táctil de pasos de preparación

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Publicar en GitHub Pages (sitio público)

### Método recomendado (automático con GitHub Actions)

1. Subí este proyecto a un repositorio de GitHub.
2. Asegurate de tener la rama `main` como rama principal.
3. Al hacer `push` a `main`, GitHub ejecutará automáticamente el workflow:
   - `.github/workflows/deploy-gh-pages.yml`
4. Configurá la fuente de GitHub Pages en `Settings > Pages` con:
   - `Source: GitHub Actions`
5. El sitio se publicará en:
   - `https://<usuario>.github.io/<nombre-del-repositorio>/`

Esta configuración calcula el path de base para Vite durante el build automático, así las rutas funcionan también cuando la app vive en una subcarpeta de GitHub Pages.

### Si preferís deploy manual (por ahora)

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173 --strictPort
```

`npm run build` sigue dejando el sitio optimizado en `dist`.

## Persistencia local

Se guarda en `localStorage` bajo:

- `coffeebreak:favorites`
- `coffeebreak:history`
