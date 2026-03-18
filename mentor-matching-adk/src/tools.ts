import { FunctionTool } from "@google/adk";
import { z } from "zod";
import axios from "axios";

const ORCHESTRATOR_URL =
  process.env.ORCHESTRATOR_URL || "http://localhost:3001";

export const matchMentors = new FunctionTool({
  name: "match_mentors",
  description:
    "Finds and ranks the top mentor candidates for a mentee. Call this when the user asks to find mentors, match a mentee, or get recommendations. Requires the mentee's user ID (e.g. usr_99).",
  parameters: z.object({
    menteeUserId: z.string().describe("The mentee user ID, e.g. usr_99"),
  }),
  execute: async ({ menteeUserId }) => {
    try {
      const res = await axios.post(
        `${ORCHESTRATOR_URL}/api/match`,
        { menteeUserId },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { status: number; data?: unknown }; message?: string };
      if (e.response?.status === 404) {
        return { error: `Mentee not found: ${menteeUserId}` };
      }
      if (e.response?.status === 503) {
        return {
          error:
            "Orchestrator or scorer not running. Start them: mentor-matching-scorer (sbt run), mentor-matching-orchestrator (npm run dev).",
        };
      }
      throw err;
    }
  },
});
