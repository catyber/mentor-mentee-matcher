import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorFetch, textResult, errorResult } from "../orchestratorClient.js";

export function registerListMentorships(server: McpServer) {
  server.registerTool(
    "list_mentorships",
    {
      title: "List All Mentorships",
      description:
        "Lists all mentorships (past and current) with mentor IDs, mentee IDs, satisfaction scores, meeting counts, and whether they ended early. Use when the user asks about mentorship history across the system, which mentors have mentored before, or overall mentorship data.",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        return textResult(await orchestratorFetch("/api/mentorships"));
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
