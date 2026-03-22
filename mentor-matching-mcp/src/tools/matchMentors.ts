import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorPost, textResult, errorResult } from "../orchestratorClient.js";

export function registerMatchMentors(server: McpServer) {
  server.registerTool(
    "match_mentors",
    {
      title: "Match Mentors for Mentee",
      description:
        "Finds and ranks the top mentor candidates for a mentee. Use when the user asks to find mentors, match a mentee, or get recommendations. Requires the mentee's user ID (e.g. usr_99).",
      inputSchema: {
        menteeUserId: z.string().describe("The mentee user ID, e.g. usr_99"),
      },
    },
    async ({ menteeUserId }) => {
      try {
        return textResult(
          await orchestratorPost("/api/match", { menteeUserId })
        );
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
