# Mentor Matching ADK Agent

ADK (Agent Development Kit) agent that uses an LLM to match mentees with mentors. Single tool `match_mentors` calls the orchestrator.

**Agentic behavior:** User says "Find mentors for usr_99" → LLM decides to call `match_mentors("usr_99")` → returns ranked results.

## Requirements

- Node.js 24+
- Gemini API key from [Google AI Studio](https://aistudio.google.com)
- Scorer and orchestrator running (ports 8081, 3001)

## Setup

```bash
npm install --ignore-scripts
```

> Use `--ignore-scripts` if native sqlite3 build fails (e.g. on Node 24 / Python 3.14). The ADK works without it for basic usage.

Create `.env`:

```
GEMINI_API_KEY=your-key-from-ai-studio
ORCHESTRATOR_URL=http://localhost:3001
```

## Run

1. Start scorer: `cd ../mentor-matching-scorer && sbt run`
2. Start orchestrator: `cd ../mentor-matching-orchestrator && npm run dev`
3. Start ADK: `npm run web`

Open http://localhost:8000 (or the URL shown), select **mentor_matching_agent** in the dropdown, and try: "Find mentors for usr_99".

## Environment

- `GEMINI_API_KEY` — Required for the LLM
- `ORCHESTRATOR_URL` — Orchestrator API (default: http://localhost:3001)
