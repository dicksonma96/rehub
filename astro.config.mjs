import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://re-hub.com.my/",
  integrations: [sitemap(), react()],
  build: {
    // This ensures that generated assets use relative paths
    // instead of absolute paths where possible
    assets: "_astro",
  },
});