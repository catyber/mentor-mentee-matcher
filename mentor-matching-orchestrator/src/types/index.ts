export interface User {
  id: string;
  managerId: string | null;
  timezone: string;
  languages: string[];
  yearsExperience: number;
}

export interface MentorProfile {
  userId: string;
  capacity: number;
  currentMenteeCount: number;
  skills: string[];
  bioText: string | null;
}

export interface MenteeProfile {
  userId: string;
  desiredSkills: string[];
  goalsText: string | null;
}

export interface Mentorship {
  id: string;
  mentorUserId: string;
  menteeUserId: string;
  satisfaction: number | null;
  meetingCount: number;
  endedEarly: boolean;
}

export interface ScoreMentorProfile {
  userId: string;
  timezone: string;
  languages: string[];
  skills: string[];
  yearsExperience: number;
  capacity: number;
  currentMenteeCount: number;
  bioText: string | null;
  bioEmbedding: number[] | null;
  pastMentorships: Mentorship[];
}

export interface ScoreMenteeProfile {
  userId: string;
  timezone: string;
  languages: string[];
  desiredSkills: string[];
  yearsExperience: number;
  goalsText: string | null;
  goalsEmbedding: number[] | null;
  reportingChain: string[];
}

export interface StructuredDetail {
  timezoneScore: number;
  languageScore: number;
  skillsScore: number;
  experienceGapScore: number;
  capacitySlackScore: number;
}

export interface ScoreBreakdown {
  structured: number;
  semantic: number;
  historical: number;
  structuredDetail: StructuredDetail;
}

export interface RankedMentor {
  mentorUserId: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
}

export interface RankRequest {
  mentee: ScoreMenteeProfile;
  mentors: ScoreMentorProfile[];
  weights?: object;
  topN?: number;
}

export interface RankResponse {
  menteeUserId: string;
  rankings: RankedMentor[];
}

export interface MatchResult {
  mentorUserId: string;
  totalScore: number;
  explanation: string;
  breakdown: ScoreBreakdown;
}

export interface MatchResponse {
  menteeUserId: string;
  topMentors: MatchResult[];
}
