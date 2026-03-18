# Mentor-Mentee Matcher

Mentor matching system for interviews: Scala scorer + TypeScript orchestrator + optional ADK agent. Ranks mentor candidates for a mentee using structured, semantic, and historical signals.

## Requirements

- Java 17+, sbt 1.9+ (for scorer)
- Node.js 18+ (for orchestrator and ADK)

## Structure

```
mentor-mentee-matcher/
├── mentor-matching-scorer/        # Scala 3 HTTP service (port 8081)
├── mentor-matching-orchestrator/  # TypeScript Express (port 3001)
├── mentor-matching-adk/          # ADK agent with match_mentors tool (port 8000)
└── README.md
```

## Quick start

1. **Start the scorer** (terminal 1)
   ```bash
   cd mentor-matching-scorer && sbt run
   ```
   Wait for the server to listen on port 8081.

2. **Start the orchestrator** (terminal 2)
   ```bash
   cd mentor-matching-orchestrator && npm install && npm run dev
   ```
   The orchestrator calls the scorer; both must be running.

3. **Test**
   ```bash
   curl -X POST http://localhost:3001/api/match \
     -H "Content-Type: application/json" \
     -d '{"menteeUserId":"usr_99"}'
   ```

4. **ADK (optional):** `cd mentor-matching-adk && npm install --ignore-scripts && npm run web`. Copy `.env.example` to `.env`, set `GEMINI_API_KEY`. Open http://localhost:8000, select **mentor_matching_agent**, try "Find mentors for usr_99". Requires Gemini API key (free tier has rate limits).

You can also test the scorer directly (see `mentor-matching-scorer/README.md` for sample `curl`).

## What's included

- **Scorer (Scala):** Pure scoring engine — constraints, structured + semantic + historical signals, configurable weights
- **Orchestrator (TypeScript):** Loads data from JSON, keyword embeddings, pre-filters, calls scorer, returns top 5
- **ADK Agent (optional):** LLM agent with `match_mentors` tool that calls the orchestrator. Requires Gemini API key.

No MCP services, no Docker. Data lives in `mentor-matching-orchestrator/data/*.json`.
