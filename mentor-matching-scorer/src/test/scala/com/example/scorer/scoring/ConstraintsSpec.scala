package com.example.scorer.scoring

import com.example.scorer.model.*
import munit.FunSuite

class ConstraintsSpec extends FunSuite:

  test("mentor at capacity is excluded") {
    val mentor = MentorProfile("m1", "UTC", Nil, Nil, 5, capacity = 2, currentMenteeCount = 2, None, None, Nil)
    val mentee = MenteeProfile("e1", "UTC", Nil, Nil, 2, None, None, Nil)
    assert(!Constraints.passesAll(mentor, mentee))
  }

  test("mentor in mentee reporting chain is excluded") {
    val mentor = MentorProfile("usr_ben", "UTC", Nil, Nil, 5, 2, 0, None, None, Nil)
    val mentee = MenteeProfile("e1", "UTC", Nil, Nil, 2, None, None, List("usr_ben", "usr_carla"))
    assert(!Constraints.notInReportingChain(mentor, mentee))
  }

  test("mentor with capacity and not in chain is kept") {
    val mentor = MentorProfile("m1", "UTC", Nil, Nil, 5, 2, 1, None, None, Nil)
    val mentee = MenteeProfile("e1", "UTC", Nil, Nil, 2, None, None, List("usr_ben"))
    assert(Constraints.passesAll(mentor, mentee))
  }

  test("filterMentors excludes at-capacity and in-chain") {
    val mentee = MenteeProfile("e1", "UTC", Nil, Nil, 2, None, None, List("usr_ben"))
    val mentors = List(
      MentorProfile("m1", "UTC", Nil, Nil, 5, 2, 1, None, None, Nil),
      MentorProfile("usr_ben", "UTC", Nil, Nil, 5, 2, 0, None, None, Nil),
      MentorProfile("m2", "UTC", Nil, Nil, 5, 2, 2, None, None, Nil)
    )
    val filtered = Constraints.filterMentors(mentors, mentee)
    assertEquals(filtered.map(_.userId), List("m1"))
  }
