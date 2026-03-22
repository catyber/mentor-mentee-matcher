export const ORCHESTRATOR_URL =
  process.env.ORCHESTRATOR_URL || "http://localhost:3001";

export async function orchestratorFetch(path: string): Promise<unknown> {
  const res = await fetch(`${ORCHESTRATOR_URL}${path}`, {
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Not found: ${path}`);
    }
    if (res.status === 503) {
      throw new Error(
        "Orchestrator or scorer not running. Start them: mentor-matching-scorer (sbt run), mentor-matching-orchestrator (npm run dev)."
      );
    }
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

export async function orchestratorPost(
  path: string,
  body: unknown
): Promise<unknown> {
  const res = await fetch(`${ORCHESTRATOR_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Not found: ${path}`);
    }
    if (res.status === 503) {
      throw new Error(
        "Orchestrator or scorer not running. Start them: mentor-matching-scorer (sbt run), mentor-matching-orchestrator (npm run dev)."
      );
    }
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

export function textResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function errorResult(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return { content: [{ type: "text" as const, text: `Error: ${message}` }] };
}
