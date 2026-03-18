import type { Mentorship } from "../types/index.js";
import { loadUsers, loadMentors, loadMentee, loadMentees, loadMentorships } from "../data/loader.js";
import { buildReportingChain } from "./reportingChain.js";
import {
  filterEligibleMentors,
  safetyFilter,
  type EnrichedMentor,
} from "./constraints.js";
import { buildVocabulary, textToVector } from "./keywordVectorizer.js";
import { callScorer } from "../clients/scorerClient.js";
import type {
  ScoreMentorProfile,
  ScoreMenteeProfile,
  MatchResponse,
  MatchResult,
  RankRequest,
  StructuredDetail,
} from "../types/index.js";
import type { User } from "../types/index.js";

export async function runMatch(menteeUserId: string): Promise<MatchResponse> {
  const users = loadUsers();
  const mentors = loadMentors();
  const menteeProfile = loadMentee(menteeUserId);
  const mentorships = loadMentorships();

  const menteeUser = users.find((u) => u.id === menteeUserId);
  if (!menteeUser) throw new Error(`User not found: ${menteeUserId}`);

  const reportingChain = buildReportingChain(menteeUserId, users);

  const enrichedMentors = enrichMentors(mentors, users);
  const eligibleMentors = filterEligibleMentors(enrichedMentors, reportingChain);

  const mentorshipsByMentor = groupMentorshipsByMentor(mentorships);

  // Keyword vectors; replace with call to embedding service (e.g. Ollama /embed, /batch-embed) for real semantic vectors.
  const mentees = loadMentees();
  const vocab = buildVocabulary(mentors, mentees);
  const goalsEmbedding = textToVector(menteeProfile.goalsText, vocab);

  const scoreMentee: ScoreMenteeProfile = {
    userId: menteeUserId,
    timezone: menteeUser.timezone,
    languages: menteeUser.languages,
    desiredSkills: menteeProfile.desiredSkills,
    yearsExperience: menteeUser.yearsExperience,
    goalsText: menteeProfile.goalsText,
    goalsEmbedding,
    reportingChain,
  };

  const scoreMentors: ScoreMentorProfile[] = eligibleMentors.map((mp) => ({
    userId: mp.userId,
    timezone: mp.timezone,
    languages: mp.languages,
    skills: mp.skills,
    yearsExperience: mp.yearsExperience,
    capacity: mp.capacity,
    currentMenteeCount: mp.currentMenteeCount,
    bioText: mp.bioText,
    bioEmbedding: textToVector(mp.bioText, vocab),
    pastMentorships: mentorshipsByMentor.get(mp.userId) ?? [],
  }));

  const rankRequest: RankRequest = {
    mentee: scoreMentee,
    mentors: scoreMentors,
    topN: 5,
  };

  const rankResponse = await callScorer(rankRequest);

  // Defensive check: re-apply constraints on scorer output in case data changed or scorer returned an ineligible mentor.
  const filtered = safetyFilter(
    rankResponse.rankings,
    scoreMentee,
    eligibleMentors
  );

  const topMentors: MatchResult[] = filtered.slice(0, 5).map((r) => ({
    mentorUserId: r.mentorUserId,
    totalScore: r.totalScore,
    explanation: generateExplanation(r.breakdown.structuredDetail),
    breakdown: r.breakdown,
  }));

  return { menteeUserId, topMentors };
}

function enrichMentors(
  mentors: { userId: string; capacity: number; currentMenteeCount: number; skills: string[]; bioText: string | null }[],
  users: User[]
): EnrichedMentor[] {
  const userMap = new Map(users.map((u) => [u.id, u]));
  return mentors.map((m) => {
    const user = userMap.get(m.userId);
    return {
      userId: m.userId,
      timezone: user?.timezone ?? "",
      languages: user?.languages ?? [],
      skills: m.skills,
      yearsExperience: user?.yearsExperience ?? 0,
      capacity: m.capacity,
      currentMenteeCount: m.currentMenteeCount,
      bioText: m.bioText,
    };
  });
}

function groupMentorshipsByMentor(
  mentorships: Mentorship[]
): Map<string, Mentorship[]> {
  const map = new Map<string, Mentorship[]>();
  for (const m of mentorships) {
    const list = map.get(m.mentorUserId) ?? [];
    list.push(m);
    map.set(m.mentorUserId, list);
  }
  return map;
}

function generateExplanation(detail: StructuredDetail): string {
  const parts: string[] = [];
  if (detail.timezoneScore >= 0.9) parts.push("same timezone");
  else if (detail.timezoneScore >= 0.5) parts.push("similar timezone");
  if (detail.languageScore >= 0.9) parts.push("full language match");
  else if (detail.languageScore >= 0.5) parts.push("partial language match");
  if (detail.skillsScore >= 0.5) parts.push("strong skill overlap");
  else if (detail.skillsScore > 0) parts.push("some skill overlap");
  if (detail.experienceGapScore >= 0.7) parts.push("good experience level");
  if (parts.length === 0) return "Matches based on available criteria.";
  return parts.join(", ") + ".";
}
