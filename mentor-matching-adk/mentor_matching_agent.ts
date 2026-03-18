/**
 * Root entry for ADK web/run. Re-exports the mentor-matching agent.
 * ADK discovers agents by filename (e.g. mentor_matching_agent.ts → "mentor_matching_agent" in the UI).
 */
export { rootAgent } from "./src/agent.js";
