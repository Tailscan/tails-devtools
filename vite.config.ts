import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import type { UserConfig } from "vite";
import { resolve } from "path";
import makeManifest from "./utils/plugins/make-manifest";
import copyLogo from "./utils/plugins/copy-logo";
import copyFonts from "./utils/plugins/copy-fonts";

const root = resolve(__dirname, "src");
const pagesDir = resolve(root, "pages");
const assetsDir = resolve(root, "assets");
const panelDir = resolve(pagesDir, "panel");
const outDir = resolve(__dirname, "dist");
const publicDir = resolve(__dirname, "public");

function selfResolve() {
  return {
    name: "selft.resolve",
    resolveId(id: string) {
      if (id === "self.resolve") {
        return "+self.resolve";
      }
    },
    load(id: string) {
      if (id === "+self.resolve") {
        return "";
      }
    },
    buildEnd() {
      console.log("end");
    },
  };
}

export const sharedConfig: UserConfig = {
  resolve: {
    alias: {
      "@src": root,
      "@pages": pagesDir,
      "@panel": panelDir,
    },
  },
  define: {
    "process.env": process.env,
  },
  plugins: [react(), makeManifest(), selfResolve(), copyLogo(), copyFonts()],
  publicDir,
};

export default defineConfig({
  ...sharedConfig,
  plugins: [...(sharedConfig.plugins || [])],
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
