import type { RankedMentor, ScoreMenteeProfile } from "../types/index.js";

export interface EnrichedMentor {
  userId: string;
  timezone: string;
  languages: string[];
  skills: string[];
  yearsExperience: number;
  capacity: number;
  currentMenteeCount: number;
  bioText: string | null;
}

export function filterEligibleMentors(
  mentors: EnrichedMentor[],
  reportingChain: string[]
): EnrichedMentor[] {
  return mentors.filter((m) => {
    if (m.currentMenteeCount >= m.capacity) return false;
    if (reportingChain.includes(m.userId)) return false;
    return true;
  });
}

export function safetyFilter(
  rankings: RankedMentor[],
  mentee: ScoreMenteeProfile,
  mentors: EnrichedMentor[]
): RankedMentor[] {
  const mentorMap = new Map(mentors.map((m) => [m.userId, m]));

  return rankings.filter((r) => {
    const mentor = mentorMap.get(r.mentorUserId);
    if (!mentor) return false;
    if (mentor.currentMenteeCount >= mentor.capacity) return false;
    if (mentee.reportingChain.includes(mentor.userId)) return false;
    return true;
  });
}
