package com.example.scorer.scoring

import com.example.scorer.model.*
import munit.FunSuite

class RankerSpec extends FunSuite:

  test("mentor at capacity is excluded from rankings") {
    val mentee = MenteeProfile("usr_99", "Europe/Vienna", List("EN", "DE"), List("backend", "scala"), 2, None, None, List("usr_ben", "usr_carla"))
    val mentors = List(
      MentorProfile("usr_01", "Europe/Vienna", List("EN", "DE"), List("backend", "scala"), 8, 2, 1, None, None, Nil),
      MentorProfile("usr_02", "Europe/Vienna", List("EN"), List("frontend"), 6, 2, 2, None, None, Nil)
    )
    val request = RankRequest(mentee, mentors, None, Some(5))
    val response = Ranker.rank(request)
    assertEquals(response.rankings.map(_.mentorUserId), List("usr_01"))
  }

  test("returns top N by score") {
    val mentee = MenteeProfile("e1", "UTC", Nil, Nil, 2, None, None, Nil)
    val mentors = List(
      MentorProfile("m1", "UTC", Nil, List("a"), 5, 2, 0, None, None, Nil),
      MentorProfile("m2", "UTC", Nil, List("b"), 5, 2, 0, None, None, Nil)
    )
    val request = RankRequest(mentee, mentors, None, Some(1))
    val response = Ranker.rank(request)
    assertEquals(response.rankings.size, 1)
  }

  test("sample data: usr_02 excluded, usr_01 > usr_04 > usr_03") {
    val mentee = MenteeProfile(
      "usr_99", "Europe/Vienna", List("EN", "DE"),
      List("backend", "scala", "career-growth"), 2,
      Some("distributed systems and lead a team"), None,
      List("usr_ben", "usr_carla")
    )
    val usr01Mentorships = List(
      Mentorship("m1", "usr_01", "usr_50", Some(5), 12, false),
      Mentorship("m2", "usr_01", "usr_51", None, 3, true)
    )
    val usr02Mentorships = List(
      Mentorship("m3", "usr_02", "usr_60", Some(4), 8, false),
      Mentorship("m4", "usr_02", "usr_61", Some(3), 6, false)
    )
    val usr03Mentorships = List(Mentorship("m5", "usr_03", "usr_70", Some(5), 10, false))
    val usr04Mentorships = List(Mentorship("m6", "usr_04", "usr_80", Some(4), 7, false))
    val mentors = List(
      MentorProfile("usr_01", "Europe/Vienna", List("EN", "DE"),
        List("backend", "scala", "distributed-systems"), 8, 2, 1,
        Some("I like helping juniors navigate ambiguity."), None, usr01Mentorships),
      MentorProfile("usr_02", "Europe/Vienna", List("EN"),
        List("frontend", "typescript", "react"), 6, 2, 2,
        Some("Career growth and interview prep."), None, usr02Mentorships),
      MentorProfile("usr_03", "America/New_York", List("EN", "ES"),
        List("data-science", "ml", "python"), 10, 1, 0,
        Some("Research background."), None, usr03Mentorships),
      MentorProfile("usr_04", "Europe/Vienna", List("EN", "DE"),
        List("backend", "java", "spring", "mentoring"), 12, 3, 1,
        None, None, usr04Mentorships)
    )
    val request = RankRequest(mentee, mentors, None, Some(5))
    val response = Ranker.rank(request)

    val ids = response.rankings.map(_.mentorUserId)
    assert(!ids.contains("usr_02"), "usr_02 should be excluded (at capacity)")
    assertEquals(ids.size, 3)
    assertEquals(ids.head, "usr_01")
    assertEquals(ids(1), "usr_04")
    assertEquals(ids(2), "usr_03")
  }

  test("custom structuredSubWeights are used when provided") {
    val mentee = MenteeProfile("e1", "UTC", List("EN"), List("scala"), 2, None, None, Nil)
    val mentors = List(
      MentorProfile("m1", "UTC", List("EN"), List("scala"), 8, 2, 0, None, None, Nil)
    )
    val customSubWeights = StructuredSubWeights(
      timezone = 0.0,
      language = 0.0,
      skills = 1.0,
      experienceGap = 0.0,
      capacitySlack = 0.0
    )
    val weights = ScoringWeights(0.5, 0.3, 0.2, Some(customSubWeights))
    val request = RankRequest(mentee, mentors, Some(weights), None)
    val response = Ranker.rank(request)
    assertEquals(response.rankings.size, 1)
    assertEquals(response.rankings.head.breakdown.structuredDetail.skillsScore, 1.0)
  }

  test("custom historicalSubWeights are used when provided") {
    val mentee = MenteeProfile("e1", "UTC", List("EN"), List("scala"), 2, None, None, Nil)
    val mentorships = List(
      Mentorship("m1", "m1", "e0", Some(5), 12, false),
      Mentorship("m2", "m1", "e1", Some(5), 12, false),
      Mentorship("m3", "m1", "e2", Some(5), 12, false)
    )
    val mentors = List(
      MentorProfile("m1", "UTC", List("EN"), List("scala"), 8, 2, 0, None, None, mentorships)
    )
    val customSubWeights = HistoricalSubWeights(satisfaction = 0.0, retention = 0.0, meeting = 1.0)
    val weights = ScoringWeights(0.5, 0.3, 0.2, None, Some(customSubWeights))
    val request = RankRequest(mentee, mentors, Some(weights), None)
    val response = Ranker.rank(request)
    assertEquals(response.rankings.size, 1)
    assert(response.rankings.head.breakdown.historical > 0.9)
  }

  test("weights re-normalize when semantic and historical are absent") {
    val mentee = MenteeProfile("e1", "UTC", List("EN"), List("scala"), 2, None, None, Nil)
    val mentors = List(
      MentorProfile("m1", "UTC", List("EN"), List("scala"), 8, 2, 0, None, None, Nil)
    )
    val request = RankRequest(mentee, mentors, None, None)
    val response = Ranker.rank(request)
    assertEquals(response.rankings.size, 1)
    val score = response.rankings.head.totalScore
    assert(score > 0.0, "should still produce a score from structured-only")
    val bd = response.rankings.head.breakdown
    assertEquals(bd.semantic, 0.0)
    assertEquals(bd.historical, 0.0)
  }
