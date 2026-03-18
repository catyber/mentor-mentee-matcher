import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { User, MentorProfile, MenteeProfile, Mentorship } from "../types/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../data");

export function loadUsers(): User[] {
  const data = readFileSync(path.join(DATA_DIR, "users.json"), "utf-8");
  return JSON.parse(data);
}

export function loadMentors(): MentorProfile[] {
  const data = readFileSync(path.join(DATA_DIR, "mentors.json"), "utf-8");
  return JSON.parse(data);
}

export function loadMentees(): MenteeProfile[] {
  const data = readFileSync(path.join(DATA_DIR, "mentees.json"), "utf-8");
  return JSON.parse(data);
}

export function loadMentee(userId: string): MenteeProfile {
  const mentees = loadMentees();
  const mentee = mentees.find((m) => m.userId === userId);
  if (!mentee) throw new Error(`Mentee not found: ${userId}`);
  return mentee;
}

export function loadMentorships(): Mentorship[] {
  const data = readFileSync(path.join(DATA_DIR, "mentorships.json"), "utf-8");
  return JSON.parse(data);
}
