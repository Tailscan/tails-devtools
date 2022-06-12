import { createRoot } from "react-dom/client";

import Panel from "./app";
import { SandboxProvider } from "./context/sandbox";
import { ThemeProvider } from "./context/theme";
import "./index.css";

function init() {
  const appContainer = document.getElementById("root");
  const sandboxFrame = document.getElementById("sandbox") as HTMLIFrameElement;

  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }

  if (!sandboxFrame) {
    throw new Error("Can not find Sandbox frame");
  }
  const root = createRoot(appContainer);
  root.render(
    <ThemeProvider>
      <SandboxProvider iframe={sandboxFrame}>
        <Panel />
      </SandboxProvider>
    </ThemeProvider>
  );
}

init();
