import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const runtimeEnv = (globalThis as {
  process?: {
    env?: Record<string, string | undefined>;
  };
}).process?.env;

const publicBase = (runtimeEnv?.VITE_PUBLIC_BASE ?? "/").trim();
const normalizedPublicBase = publicBase.endsWith("/")
  ? publicBase
  : `${publicBase}/`;

export default defineConfig({
  base: normalizedPublicBase,
  plugins: [react()],
});
