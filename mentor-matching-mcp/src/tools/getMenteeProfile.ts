import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorFetch, textResult, errorResult } from "../orchestratorClient.js";

export function registerGetMenteeProfile(server: McpServer) {
  server.registerTool(
    "get_mentee_profile",
    {
      title: "Get Mentee Profile",
      description:
        "Gets the full profile for a mentee (user data + goals, skills). Use when the user asks about a specific mentee, e.g. 'tell me about usr_99'.",
      inputSchema: {
        menteeUserId: z.string().describe("The mentee user ID, e.g. usr_99"),
      },
    },
    async ({ menteeUserId }) => {
      try {
        return textResult(await orchestratorFetch(`/api/mentees/${menteeUserId}`));
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
