import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { orchestratorFetch, textResult, errorResult } from "../orchestratorClient.js";

export function registerGetMentorProfile(server: McpServer) {
  server.registerTool(
    "get_mentor_profile",
    {
      title: "Get Mentor Profile",
      description:
        "Gets the full profile for a mentor (skills, bio, capacity, experience, and past mentorships). Use when the user asks about a specific mentor, e.g. 'tell me about mentor usr_01'.",
      inputSchema: {
        mentorUserId: z.string().describe("The mentor user ID, e.g. usr_01"),
      },
    },
    async ({ mentorUserId }) => {
      try {
        return textResult(await orchestratorFetch(`/api/mentors/${mentorUserId}`));
      } catch (err) {
        return errorResult(err);
      }
    }
  );
}
