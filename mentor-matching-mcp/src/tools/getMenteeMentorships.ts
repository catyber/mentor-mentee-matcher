import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorFetch, textResult, errorResult } from "../orchestratorClient.js";

export function registerGetMenteeMentorships(server: McpServer) {
  server.registerTool(
    "get_mentee_mentorships",
    {
      title: "Get Mentee Mentorships",
      description:
        "Gets previous mentorships for a mentee. Use when the user asks if a mentee has had mentors, their mentorship history, or past mentors.",
      inputSchema: {
        menteeUserId: z.string().describe("The mentee user ID, e.g. usr_99"),
      },
    },
    async ({ menteeUserId }) => {
      try {
        return textResult(
          await orchestratorFetch(`/api/mentees/${menteeUserId}/mentorships`)
        );
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
