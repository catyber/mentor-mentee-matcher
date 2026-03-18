import type { User } from "../types/index.js";

export function buildReportingChain(userId: string, users: User[]): string[] {
  const userMap = new Map(users.map((u) => [u.id, u]));
  const chain: string[] = [];
  let current = userMap.get(userId);

  while (current?.managerId) {
    chain.push(current.managerId);
    current = userMap.get(current.managerId);
  }

  return chain;
}
