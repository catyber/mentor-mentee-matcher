# Mentor Matching Scorer

Scala 3 HTTP service that ranks mentor candidates for a mentee.

**What it does:** Given a mentee profile and a list of mentor candidates, the scorer applies hard constraints (capacity, reporting chain), then scores each eligible mentor using three signals: **structured** (timezone, language, skills, experience gap, capacity slack), **semantic** (cosine similarity of goals vs bio embeddings), and **historical** (past mentorship satisfaction, retention, meeting consistency). Scores are combined with configurable weights and returned as a ranked list with breakdowns.

## Requirements

- Java 17+
- sbt 1.9+

## Run

```bash
sbt run
```

Server listens on **http://localhost:8081**.

If you see `Address already in use`, another process is using port 8081. Stop it first (e.g. `lsof -i :8081` to find the PID, then `kill <PID>`), or stop a previous `sbt run` with Ctrl+C.

## Test

```bash
sbt test
```

## Project structure

| Path | Purpose |
|------|---------|
| `model/Domain.scala` | `MentorProfile`, `MenteeProfile`, `Mentorship` |
| `model/RankingModels.scala` | `RankRequest`, `RankResponse`, `ScoringWeights`, sub-weights, score breakdowns |
| `scoring/Constraints.scala` | Hard filters: capacity, reporting chain |
| `scoring/StructuredScorer.scala` | Timezone, language, skills, experience gap, capacity slack |
| `scoring/SemanticScorer.scala` | Cosine similarity on embeddings |
| `scoring/HistoricalScorer.scala` | Satisfaction, retention, meeting consistency |
| `scoring/Ranker.scala` | Orchestrates scoring and combines signals |
| `api/Routes.scala` | HTTP endpoints |
| `Main.scala` | Server entry point |

## API

- **GET /health** — Returns `{"status":"ok"}`
- **POST /rank** — Body: `RankRequest` (mentee, mentors, optional weights, optional topN). Returns `RankResponse` with ranked list and score breakdowns. Schemas in `Domain.scala` and `RankingModels.scala`.

## Sample call

With the server running (`sbt run`), you can test the scorer without the orchestrator:

```bash
curl -s -X POST http://localhost:8081/rank \
  -H "Content-Type: application/json" \
  -d '{
    "mentee": {
      "userId": "mentee_01",
      "timezone": "Europe/London",
      "languages": ["EN"],
      "desiredSkills": ["scala", "backend"],
      "yearsExperience": 2,
      "goalsText": null,
      "goalsEmbedding": null,
      "reportingChain": ["manager_01"]
    },
    "mentors": [
      {
        "userId": "mentor_01",
        "timezone": "Europe/London",
        "languages": ["EN"],
        "skills": ["scala", "java", "backend"],
        "yearsExperience": 8,
        "capacity": 3,
        "currentMenteeCount": 1,
        "bioText": null,
        "bioEmbedding": null,
        "pastMentorships": [
          {"id": "m1", "mentorUserId": "mentor_01", "menteeUserId": "e1", "satisfaction": 5, "meetingCount": 12, "endedEarly": false},
          {"id": "m2", "mentorUserId": "mentor_01", "menteeUserId": "e2", "satisfaction": 4, "meetingCount": 10, "endedEarly": false},
          {"id": "m3", "mentorUserId": "mentor_01", "menteeUserId": "e3", "satisfaction": 5, "meetingCount": 11, "endedEarly": false}
        ]
      },
      {
        "userId": "mentor_02",
        "timezone": "America/New_York",
        "languages": ["EN"],
        "skills": ["python", "data"],
        "yearsExperience": 5,
        "capacity": 2,
        "currentMenteeCount": 0,
        "bioText": null,
        "bioEmbedding": null,
        "pastMentorships": []
      }
    ],
    "weights": null,
    "topN": 5
  }'
```

Example response:

```json
{
  "menteeUserId": "mentee_01",
  "rankings": [
    {
      "mentorUserId": "mentor_01",
      "totalScore": 0.85,
      "breakdown": {
        "structured": 0.9,
        "semantic": 0.0,
        "historical": 0.95,
        "structuredDetail": {
          "timezoneScore": 1.0,
          "languageScore": 1.0,
          "skillsScore": 0.67,
          "experienceGapScore": 1.0,
          "capacitySlackScore": 0.67
        }
      }
    }
  ]
}
```

Note: Without embeddings, semantic score is 0 and weights re-normalize to structured + historical. `mentor_01` ranks higher (same timezone, skill overlap, strong historical); `mentor_02` ranks lower (different timezone, no skill overlap, no historical data).

## Build fat JAR

```bash
sbt assembly
```

JAR is written to `target/scala-3.x.x/mentor-matching-scorer-assembly-0.1.0.jar`. Run with:

```bash
java -jar target/scala-3.*/mentor-matching-scorer-assembly-0.1.0.jar
```
