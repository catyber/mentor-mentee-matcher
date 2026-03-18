import "dotenv/config";
import { LlmAgent } from "@google/adk";
import { matchMentors } from "./tools.js";

export const rootAgent = new LlmAgent({
  name: "mentor_matching_agent",
  model: "gemini-2.0-flash",
  description:
    "An agent that finds and ranks mentor candidates for mentees. Use the match_mentors tool when the user asks to find mentors for a mentee.",
  instruction: `You are a mentor-matching assistant. When a user asks to find mentors for a mentee (e.g. "Find mentors for usr_99" or "Match usr_99 with mentors"):

1. Call match_mentors with the mentee's user ID.
2. Present the ranked results clearly: mentor ID, total score, and the short explanation for each.
3. If the mentee is not found or a service is down, explain the error to the user.

Always use the match_mentors tool — do NOT make up scores or data. If you don't have a mentee user ID, ask the user for it.`,
  tools: [matchMentors],
});
