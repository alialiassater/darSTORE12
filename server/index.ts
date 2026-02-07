import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = createServer(app);

(async () => {
  await registerRoutes(httpServer, app);

  const port = Number(process.env.PORT || 5000);
  httpServer.listen(port, "0.0.0.0", () => {
    console.log("Server running on port", port);
  });
})();
