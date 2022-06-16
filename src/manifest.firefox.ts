import packageJson from "../package.json";

const manifest = {
  manifest_version: 2,
  name: "Tailwind CSS Devtools",
  author: "tungtbt",
  version: packageJson.version,
  description: packageJson.description,
  permissions: ["<all_urls>"],
  icons: {
    "128": "./logo.png",
  },
  browser_action: {
    default_icon: {
      "128": "./logo.png",
    },
  },
  web_accessible_resources: ["fonts/*"],
  devtools_page: "src/pages/devtools/index.html",
  content_security_policy:
    "script-src 'self' 'unsafe-eval'; object-src 'self';",
};

export default manifest;
