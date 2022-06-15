import * as fs from "fs";
import * as path from "path";
import { PluginOption } from "vite";

import colorLog from "../log";
import manifestFirefox from "../../src/manifest.firefox";

const { resolve } = path;

const outDir = resolve(__dirname, "..", "..", "public");

export default function makeManifest(): PluginOption {
  return {
    name: "make-manifest-firefox",
    buildEnd() {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }

      const manifestPath = resolve(outDir, "manifest.json");

      fs.writeFileSync(manifestPath, JSON.stringify(manifestFirefox, null, 2));

      colorLog(
        `Manifest Firefox file copy complete: ${manifestPath}`,
        "success"
      );
    },
  };
}
