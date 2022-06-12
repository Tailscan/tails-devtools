import * as fs from "fs";
import * as path from "path";
import { PluginOption } from "vite";

import colorLog from "../log";

const { resolve } = path;

const root = resolve(__dirname, "..", "..");
const fontsFir = resolve(root, "src", "fonts");
const outDir = resolve(__dirname, "..", "..", "public", "fonts");

async function copyDir(src: string, dest: string) {
  try {
    await fs.mkdirSync(dest, { recursive: true });
    const entries = await fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      entry.isDirectory()
        ? await copyDir(srcPath, destPath)
        : await fs.copyFileSync(srcPath, destPath);
    }
  } catch (error) {
    console.log(error);
  }
}

export default function copyFonts(): PluginOption {
  return {
    name: "copy-fonts",
    buildEnd() {
      copyDir(fontsFir, outDir);

      colorLog(`fonts copied`, "success");
    },
  };
}
