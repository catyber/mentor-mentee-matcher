# Mentor Matching Orchestrator

TypeScript Express service that orchestrates mentor-mentee matching: loads data from JSON files, applies pre-filtering, calls the Scala scorer, and returns ranked results.

**What it does:** Receives a mentee user ID, loads users/mentors/mentees/mentorships from `data/*.json`, builds the mentee's reporting chain, pre-filters mentors (capacity, reporting chain), enriches profiles with user data, groups mentorships by mentor, produces **keyword-based embeddings** (vocab from skills + tokenized goals/bios; L2-normalized vectors) for semantic scoring, and calls the Scala scorer. Returns top 5 with score breakdowns and short explanations.

## Requirements

- Node.js 18+
- Scala scorer running on port 8081

## Run

```bash
npm install
npm run dev
```

Server listens on **http://localhost:3001**.

If you see `Address already in use`, another process is using port 3001. Stop it first (e.g. `lsof -i :3001` to find the PID, then `kill <PID>`).

## Project structure

| Path | Purpose |
|------|---------|
| `data/*.json` | users, mentors, mentees, mentorships |
| `src/data/loader.ts` | Load JSON from disk |
| `src/orchestrator/reportingChain.ts` | Build manager chain from users |
| `src/orchestrator/constraints.ts` | Pre-filter by capacity, reporting chain |
| `src/orchestrator/keywordVectorizer.ts` | Build vocab, convert goals/bio text to vectors |
| `src/orchestrator/matchFlow.ts` | Assemble data, call scorer, return results |
| `src/clients/scorerClient.ts` | HTTP client for Scala scorer |
| `src/routes/match.ts` | POST /api/match handler |
| `src/index.ts` | Express server |

## API

- **GET /health** — Returns `{"status":"ok"}`
- **POST /api/match** — Body: `{ "menteeUserId": "usr_99" }`. Returns ranked top 5 mentors with score breakdowns.

## Sample call

With the scorer and orchestrator running:

```bash
curl -s -X POST http://localhost:3001/api/match \
  -H "Content-Type: application/json" \
  -d '{"menteeUserId":"usr_99"}'
```

Example response:

```json
{
  "menteeUserId": "usr_99",
  "topMentors": [
    {
      "mentorUserId": "usr_01",
      "totalScore": 0.87,
      "explanation": "same timezone, full language match, strong skill overlap, good experience level.",
      "breakdown": {
        "structured": 0.9,
        "semantic": 0.65,
        "historical": 0.5,
        "structuredDetail": { "timezoneScore": 1.0, "languageScore": 1.0, "skillsScore": 0.67, "experienceGapScore": 1.0, "capacitySlackScore": 0.67 }
      }
    }
  ]
}
```

Note: Semantic score is now computed from keyword vectors (goals vs bio text similarity); it may vary based on vocabulary overlap.

## Data

Data is loaded from `data/*.json` (users, mentors, mentees, mentorships). No external MCP services required. **Keyword-based embeddings** are computed inline: vocabulary built from skills, desired_skills, and tokenized goals/bios; each text is converted to a binary L2-normalized vector for semantic scoring via cosine similarity.

## Environment

- `PORT` — Orchestrator port (default: 3001)
- `SCALA_SCORER_URL` — Scorer URL (default: http://localhost:8081)
