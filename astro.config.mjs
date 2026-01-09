// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  build: {
    // This ensures that generated assets use relative paths
    // instead of absolute paths where possible
    assets: "_astro",
  },
});
