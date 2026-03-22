/**
 * Mentor-matching ADK agent using MCPToolset (Streamable HTTP).
 * Connects to the MCP server on port 3002, which proxies to the Orchestrator.
 * Architecture: ADK → MCP → Orchestrator → Scorer
 */
import "dotenv/config";
import { LlmAgent, MCPToolset } from "@google/adk";
import { Custom } from "adk-llm-bridge";

const MCP_URL = process.env.MCP_URL || "http://localhost:3002/mcp";

const groqModel = Custom("llama-3.3-70b-versatile", {
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const mcpToolset = new MCPToolset({
  type: "StreamableHTTPConnectionParams",
  url: MCP_URL,
});

export const rootAgent = new LlmAgent({
  name: "mentor_matching_agent",
  model: groqModel,
  description:
    "An agent that helps with mentor-mentee matching. Can list mentors and mentees, view profiles, check mentorship history, and find top mentor recommendations.",
  instruction:
    "You are a mentor-matching assistant. Use the available tools to answer questions about mentors, mentees, mentorship history, and matching recommendations. " +
    "Always use tools to retrieve data. Do NOT make up data or guess — if a tool exists for it, call it. " +
    "Present results clearly and concisely.",
  tools: [mcpToolset],
});
