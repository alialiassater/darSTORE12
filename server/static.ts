import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // public folder (فين يكون build تاع الفرونت)
  const distPath = path.resolve(__dirname, "public");

  // serve static files
  app.use(express.static(distPath));

  // SPA fallback → index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
