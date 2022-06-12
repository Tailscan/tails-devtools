import * as fs from "fs";
import * as path from "path";
import { PluginOption } from "vite";

import colorLog from "../log";

const { resolve } = path;

const root = resolve(__dirname, "..", "..");
const logo = resolve(root, "src", "assets", "img", "logo.png");
const outDir = resolve(__dirname, "..", "..", "public");

export default function copyLogo(): PluginOption {
  return {
    name: "copy-logo",
    buildEnd() {
      fs.copyFileSync(logo, resolve(outDir, "logo.png"));

      colorLog(`logo copied`, "success");
    },
  };
}
