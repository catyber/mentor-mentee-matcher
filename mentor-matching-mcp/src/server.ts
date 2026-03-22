import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListMentors } from "./tools/listMentors.js";
import { registerListMentorships } from "./tools/listMentorships.js";
import { registerListMentees } from "./tools/listMentees.js";
import { registerGetMentorProfile } from "./tools/getMentorProfile.js";
import { registerGetMenteeProfile } from "./tools/getMenteeProfile.js";
import { registerGetMenteeMentorships } from "./tools/getMenteeMentorships.js";
import { registerMatchMentors } from "./tools/matchMentors.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "mentor-matching",
    version: "1.0.0",
  });

  registerListMentors(server);
  registerListMentorships(server);
  registerListMentees(server);
  registerGetMentorProfile(server);
  registerGetMenteeProfile(server);
  registerGetMenteeMentorships(server);
  registerMatchMentors(server);

  return server;
}
