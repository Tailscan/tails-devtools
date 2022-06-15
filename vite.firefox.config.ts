import { defineConfig } from "vite";
import { resolve } from "path";
import makeManifest from "./utils/plugins/make-manifest-firefox";
import { sharedConfig } from "./vite.config";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const outDir = resolve(__dirname, "firefox");

export default defineConfig({
  ...sharedConfig,
  plugins: [...(sharedConfig.plugins || []), makeManifest()],
  build: {
    target: ["es2020"],
    outDir,
    rollupOptions: {
      input: {
        devtools: resolve(pagesDir, "devtools", "index.html"),
        panel: resolve(pagesDir, "panel", "index.html"),
        sandbox: resolve(pagesDir, "sandbox", "index.html"),
      },
      output: {
        entryFileNames: (chunk) => `src/pages/${chunk.name}/index.js`,
      },
    },
  },
});
