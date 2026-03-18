package com.example.scorer.scoring

import com.example.scorer.model.Mentorship
import munit.FunSuite

class HistoricalScorerSpec extends FunSuite:

  test("fewer than 3 mentorships returns None") {
    val mentorships = List(
      Mentorship("1", "m1", "e1", Some(5), 12, false),
      Mentorship("2", "m1", "e2", Some(4), 10, false)
    )
    assertEquals(HistoricalScorer.score(mentorships), None)
  }

  test("3+ mentorships with good ratings return Some(high score)") {
    val mentorships = List(
      Mentorship("1", "m1", "e1", Some(5), 12, false),
      Mentorship("2", "m1", "e2", Some(5), 12, false),
      Mentorship("3", "m1", "e3", Some(5), 12, false)
    )
    val result = HistoricalScorer.score(mentorships)
    assert(result.isDefined)
    assert(result.get > 0.9)
  }
