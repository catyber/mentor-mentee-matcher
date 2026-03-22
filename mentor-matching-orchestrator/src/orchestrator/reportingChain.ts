import type { User } from "../types/index.js";

export function buildReportingChain(userId: string, users: User[]): string[] {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const chain: string[] = [];
  const visited = new Set<string>();
  let current = userMap.get(userId);

  while (current?.managerId) {
    if (visited.has(current.managerId)) break;
    chain.push(current.managerId);
    visited.add(current.managerId);
    current = userMap.get(current.managerId);
  }

  return chain;
}
