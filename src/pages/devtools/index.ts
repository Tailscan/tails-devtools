try {
  chrome.devtools.panels.elements.createSidebarPane(
    "Tailwind CSS",
    function (sidebar) {
      sidebar.setHeight("100vh");
      sidebar.setPage("src/pages/panel/index.html");
    }
  );
} catch (e) {
  console.error(e);
}
