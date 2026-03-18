import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { runMatch } from "../orchestrator/matchFlow.js";

const router = Router();

const matchSchema = z.object({
  menteeUserId: z.string().min(1),
});

router.post("/match", async (req: Request, res: Response) => {
  try {
    const parsed = matchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "menteeUserId is required in request body" });
      return;
    }
    const result = await runMatch(parsed.data.menteeUserId);
    res.json(result);
  } catch (err: unknown) {
    const e = err as { message?: string; code?: string; response?: { status: number } };
    if (e.response?.status === 404) {
      res.status(404).json({ error: "Not found" });
    } else if (e.message?.includes("not found")) {
      res.status(404).json({ error: e.message });
    } else if (e.code === "ECONNREFUSED") {
      res.status(503).json({
        error: "Scala scorer not running. Start it with: cd mentor-matching-scorer && sbt run",
      });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
