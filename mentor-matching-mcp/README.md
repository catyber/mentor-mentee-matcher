# Mentor Matching MCP Server

MCP (Model Context Protocol) server that exposes mentor-matching tools over **Streamable HTTP** (port 3002). Consumed by the ADK agent via MCPToolset and also usable from Cursor.

**Tools:** `list_mentors`, `list_mentorships`, `list_mentees`, `get_mentor_profile`, `get_mentee_profile`, `get_mentee_mentorships`, `match_mentors`

**Used by:**
- **ADK Agent:** Connects via `MCPToolset` with `StreamableHTTPConnectionParams` at `http://localhost:3002/mcp`
- **Cursor:** Configured via `.cursor/mcp.json` (Streamable HTTP URL)

## Requirements

- Node.js 18+
- Orchestrator running on port 3001 (and scorer on port 8081 for `match_mentors`)

## Build & Run

```bash
cd mentor-matching-mcp
npm install
npm run build
npm start
```

Server listens on **http://localhost:3002/mcp**.

## Cursor configuration

The project includes `.cursor/mcp.json` that connects to the running MCP server. Ensure:

1. Start scorer and orchestrator
2. Build and start the MCP server: `cd mentor-matching-mcp && npm run build && npm start`
3. Restart Cursor (or reload the window) to pick up the MCP config

Then in Cursor chat you can say:
- "List all mentors"
- "Find mentors for usr_99"
- "List mentees"
- "Tell me about usr_99"

## Project structure

| Path | Purpose |
|------|---------|
| `src/index.ts` | Express server + session management |
| `src/server.ts` | `createMcpServer` factory, registers all tools |
| `src/orchestratorClient.ts` | HTTP helper to call orchestrator, result formatters |
| `src/tools/listMentors.ts` | `list_mentors` tool |
| `src/tools/listMentorships.ts` | `list_mentorships` tool |
| `src/tools/listMentees.ts` | `list_mentees` tool |
| `src/tools/getMentorProfile.ts` | `get_mentor_profile` tool |
| `src/tools/getMenteeProfile.ts` | `get_mentee_profile` tool |
| `src/tools/getMenteeMentorships.ts` | `get_mentee_mentorships` tool |
| `src/tools/matchMentors.ts` | `match_mentors` tool |

## Environment

- `ORCHESTRATOR_URL` — Orchestrator API (default: http://localhost:3001)
- `MCP_PORT` — Server port (default: 3002)
