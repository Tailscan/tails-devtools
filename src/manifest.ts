import { ManifestType } from "@src/manifest-type";
import packageJson from "../package.json";

const manifest: ManifestType = {
  manifest_version: 3,
  name: "Tailwind CSS Devtools",
  author: "tungtbt",
  version: packageJson.version,
  description: packageJson.description,
  icons: {
    "128": "./logo.png",
  },
  devtools_page: "src/pages/devtools/index.html",
  sandbox: {
    pages: ["src/pages/sandbox/index.html"],
  },
};

export default manifest;
