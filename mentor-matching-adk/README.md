# Mentor Matching ADK Agent

ADK (Agent Development Kit) agent that uses an LLM to match mentees with mentors. Connects to the MCP server via **MCPToolset** (Streamable HTTP) to discover and call tools dynamically. Uses **Groq** (Llama 3.3 70B) via `adk-llm-bridge` — free tier, OpenAI-compatible.

**Architecture:** ADK (MCPToolset) → MCP Server (:3002) → Orchestrator (:3001) → Scorer (:8081)

**Agentic behavior:** User says "Give me the list of mentees" → LLM calls `list_mentees` → then "Tell me about usr_99" → `get_mentee_profile` → "Top 5 mentors for usr_99" → `match_mentors`.

## Requirements

- Node.js 18+
- Groq API key (free at [console.groq.com](https://console.groq.com))
- MCP server running on port 3002
- Scorer and orchestrator running (ports 8081, 3001)

## Setup

```bash
cd mentor-matching-adk
npm install --ignore-scripts
```

> Use `--ignore-scripts` if native sqlite3 build fails (e.g. on Node 24). The ADK works without it for basic usage.

Create `.env`:

```
GROQ_API_KEY=your-key-from-groq-console
MCP_URL=http://localhost:3002/mcp
```

## Groq signup and API key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with email or GitHub (no credit card required)
3. Open **API Keys** in the left sidebar
4. Click **Create API Key** → name it (e.g. "mentor-matcher")
5. Copy the key and add it to `.env` as `GROQ_API_KEY=...`

## Run

1. Start scorer: `cd ../mentor-matching-scorer && sbt run`
2. Start orchestrator: `cd ../mentor-matching-orchestrator && npm run dev`
3. Start MCP server: `cd ../mentor-matching-mcp && npm run build && npm start`
4. Start ADK: `cd mentor-matching-adk && npm run web`

Open **http://localhost:8000**, select **mentor_matching_agent**, and try:
- "List all mentors"
- "Give me the list of mentees"
- "Tell me about usr_99"
- "Does usr_99 have previous mentorships?"
- "Which mentors have mentored before?"
- "Top 5 mentors for usr_99"

## Environment

- `GROQ_API_KEY` — Required. LLM API key (get at [console.groq.com](https://console.groq.com))
- `MCP_URL` — MCP server endpoint (default: http://localhost:3002/mcp)
