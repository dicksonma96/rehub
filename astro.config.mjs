import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://re-hub.com.my/",
  integrations: [sitemap()],
  build: {
    // This ensures that generated assets use relative paths
    // instead of absolute paths where possible
    assets: "_astro",
  },
});
