import express from "express";
import matchRouter from "./routes/match.js";
import apiRouter from "./routes/api.js";

const app = express();
const port = parseInt(process.env.PORT || "3001", 10);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);
app.use("/api", matchRouter);

app.listen(port, () => {
  console.log(`Orchestrator running on http://localhost:${port}`);
  console.log(`Scala scorer at ${process.env.SCALA_SCORER_URL || "http://localhost:8081"}`);
});
