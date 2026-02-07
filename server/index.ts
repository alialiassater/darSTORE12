import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);

(async () => {
  await registerRoutes(httpServer, app);

  if (process.env.NODE_ENV !== "production") {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  } else {
    const serverDir = import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname);
    let distPath = path.resolve(serverDir, "public");
    if (!fs.existsSync(distPath)) {
      distPath = path.resolve(serverDir, "..", "dist", "public");
    }
    app.use(express.static(distPath));
    app.use("/{*path}", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(503).json({ error: "Frontend not built. Run: npm run build" });
      }
    });
  }

  const port = Number(process.env.PORT || 5000);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log("Server running on port", port);
  });
})();
