import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorFetch, textResult, errorResult } from "../orchestratorClient.js";

export function registerListMentors(server: McpServer) {
  server.registerTool(
    "list_mentors",
    {
      title: "List Mentors",
      description:
        "Lists all mentors with their user IDs, skills, capacity, and experience. Use when the user asks for the list of mentors, available mentors, or who can mentor.",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        return textResult(await orchestratorFetch("/api/mentors"));
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
