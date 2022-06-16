import { isChrome, platform } from "@src/platform";
try {
  platform.devtools.panels.elements.createSidebarPane(
    "Tailwind CSS",
    function (sidebar: any) {
      if (isChrome) {
        sidebar.setPage("src/pages/panel/index.html");
        sidebar.setHeight("100vh");
      } else {
        sidebar.setPage("../panel/index.html");
      }
    }
  );
} catch (e) {
  console.error(e);
}
