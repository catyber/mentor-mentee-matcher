/**
 * MCP server entry point.
 * Serves over Streamable HTTP so ADK can connect via MCPToolset.
 * Each client session gets its own McpServer instance.
 */
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { randomUUID } from "node:crypto";
import { createMcpServer } from "./server.js";

const MCP_PORT = parseInt(process.env.MCP_PORT || "3002", 10);

async function main() {
  const app = express();
  app.use(express.json());

  const transports = new Map<string, StreamableHTTPServerTransport>();

  app.all("/mcp", async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (req.method === "GET" || req.method === "DELETE") {
      const transport = sessionId ? transports.get(sessionId) : undefined;
      if (!transport) {
        res.status(400).json({ error: "No valid session" });
        return;
      }
      await transport.handleRequest(req, res, req.body);
      if (req.method === "DELETE") {
        transports.delete(sessionId!);
      }
      return;
    }

    if (!sessionId) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid) transports.delete(sid);
      };
      const server = createMcpServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      const sid = transport.sessionId;
      if (sid) transports.set(sid, transport);
      return;
    }

    const transport = transports.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    await transport.handleRequest(req, res, req.body);
  });

  app.listen(MCP_PORT, () => {
    console.log(
      `Mentor matching MCP server running on http://localhost:${MCP_PORT}/mcp`
    );
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
