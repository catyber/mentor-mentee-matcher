import { Router, type Request, type Response } from "express";
import { loadUsers, loadMentors, loadMentees, loadMentorships } from "../data/loader.js";

const router = Router();

/** GET /api/mentors - List all mentors with skills and capacity */
router.get("/mentors", (_req: Request, res: Response) => {
  try {
    const mentors = loadMentors();
    const users = loadUsers();
    res.json({
      mentors: mentors.map((m) => {
        const user = users.find((u) => u.id === m.userId);
        return {
          userId: m.userId,
          skills: m.skills,
          capacity: m.capacity,
          currentMenteeCount: m.currentMenteeCount,
          ...(user && {
            timezone: user.timezone,
            languages: user.languages,
            yearsExperience: user.yearsExperience,
          }),
        };
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/mentors/:id - Get mentor profile (user + mentor data + past mentorships) */
router.get("/mentors/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mentors = loadMentors();
    const mentor = mentors.find((m) => m.userId === id);
    if (!mentor) {
      res.status(404).json({ error: `Mentor not found: ${id}` });
      return;
    }
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    const mentorships = loadMentorships().filter((m) => m.mentorUserId === id);
    res.json({
      userId: mentor.userId,
      skills: mentor.skills,
      bioText: mentor.bioText,
      capacity: mentor.capacity,
      currentMenteeCount: mentor.currentMenteeCount,
      pastMentorships: mentorships,
      ...(user && {
        timezone: user.timezone,
        languages: user.languages,
        yearsExperience: user.yearsExperience,
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/mentorships - List all mentorships */
router.get("/mentorships", (_req: Request, res: Response) => {
  try {
    const mentorships = loadMentorships();
    res.json({ mentorships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/mentees - List all mentee user IDs */
router.get("/mentees", (_req: Request, res: Response) => {
  try {
    const mentees = loadMentees();
    res.json({
      mentees: mentees.map((m) => ({
        userId: m.userId,
        desiredSkills: m.desiredSkills,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/mentees/:id - Get mentee profile (user + mentee data) */
router.get("/mentees/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mentees = loadMentees();
    const mentee = mentees.find((m) => m.userId === id);
    if (!mentee) {
      res.status(404).json({ error: `Mentee not found: ${id}` });
      return;
    }
    const users = loadUsers();
    const user = users.find((u) => u.id === id);
    res.json({
      userId: mentee.userId,
      desiredSkills: mentee.desiredSkills,
      goalsText: mentee.goalsText,
      ...(user && {
        timezone: user.timezone,
        languages: user.languages,
        yearsExperience: user.yearsExperience,
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/** GET /api/mentees/:id/mentorships - Get mentorships for a mentee */
router.get("/mentees/:id/mentorships", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const mentees = loadMentees();
    const mentee = mentees.find((m) => m.userId === id);
    if (!mentee) {
      res.status(404).json({ error: `Mentee not found: ${id}` });
      return;
    }
    const mentorships = loadMentorships().filter((m) => m.menteeUserId === id);
    res.json({
      menteeUserId: id,
      mentorships,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
