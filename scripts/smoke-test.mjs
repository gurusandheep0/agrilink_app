import React from "react";
import { renderToString } from "react-dom/server";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

const vite = await createServer({
  appType: "custom",
  configFile: false,
  logLevel: "error",
  plugins: [react()],
  server: { middlewareMode: true, hmr: false },
});

try {
  const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
  const html = renderToString(React.createElement(App));

  const expectedCopy = ["AgriLink", "The right service", "Continue"];
  const missingCopy = expectedCopy.filter((text) => !html.includes(text));

  if (missingCopy.length) {
    throw new Error(`Initial render is missing expected copy: ${missingCopy.join(", ")}`);
  }

  console.log(`Smoke test passed: rendered ${html.length.toLocaleString()} characters of HTML.`);
} finally {
  await vite.close();
}
