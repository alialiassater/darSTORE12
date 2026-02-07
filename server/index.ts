import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import path from "path";

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
    const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
    app.use(express.static(distPath));
    app.use("/{*path}", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = Number(process.env.PORT || 5000);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log("Server running on port", port);
  });
})();
