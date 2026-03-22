import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorFetch, textResult, errorResult } from "../orchestratorClient.js";

export function registerListMentees(server: McpServer) {
  server.registerTool(
    "list_mentees",
    {
      title: "List Mentees",
      description:
        "Lists all mentees with their user IDs and desired skills. Use when the user asks for the list of mentees, who can be matched, or available mentees.",
      inputSchema: z.object({}),
    },
    async () => {
      try {
        return textResult(await orchestratorFetch("/api/mentees"));
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
