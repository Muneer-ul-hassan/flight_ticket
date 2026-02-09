import { setupApp } from "./app";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

(async () => {
  const app = await setupApp();
  const server = createServer(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5001
  const port = 5001;
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
