package com.example.scorer.scoring

import com.example.scorer.model.*
import munit.FunSuite

class StructuredScorerSpec extends FunSuite:

  test("same timezone gives timezoneScore ~ 1.0") {
    val s = StructuredScorer.timezoneScore("Europe/Vienna", "Europe/Vienna")
    assert(s > 0.99)
  }

  test("language full overlap gives 1.0") {
    assertEquals(StructuredScorer.languageScore(List("EN", "DE"), List("EN", "DE")), 1.0)
  }

  test("language partial overlap gives 0.5") {
    assertEquals(StructuredScorer.languageScore(List("EN"), List("EN", "DE")), 0.5)
  }

  test("skills Jaccard: full overlap") {
    assertEquals(StructuredScorer.skillsScore(List("a", "b"), List("a", "b")), 1.0)
  }

  test("experience gap: mentor less experienced gives 0.0") {
    assertEquals(StructuredScorer.experienceGapScore(1, 5), 0.0)
  }

  test("experience gap: sweet spot 3-8 years gives 1.0") {
    assertEquals(StructuredScorer.experienceGapScore(8, 2), 1.0)
  }

  test("capacity slack: 0 slack gives 0.0") {
    assertEquals(StructuredScorer.capacitySlackScore(2, 2), 0.0)
  }

  test("capacity slack: 3+ slack gives 1.0") {
    assertEquals(StructuredScorer.capacitySlackScore(5, 1), 1.0)
  }

  test("language no overlap gives 0.0") {
    assertEquals(StructuredScorer.languageScore(List("FR"), List("EN", "DE")), 0.0)
  }

  test("skills Jaccard: partial overlap") {
    val s = StructuredScorer.skillsScore(List("a", "b", "c"), List("a", "d"))
    assert(s > 0.0 && s < 1.0)
  }

  test("invalid timezone returns 0.5 (neutral)") {
    assertEquals(StructuredScorer.timezoneScore("Not/A/Zone", "Europe/Vienna"), 0.5)
  }

  test("experience gap: barely more experienced gives 0.4") {
    assertEquals(StructuredScorer.experienceGapScore(4, 3), 0.4)
  }

  test("experience gap: very senior (9-15) gives 0.7") {
    assertEquals(StructuredScorer.experienceGapScore(17, 5), 0.7)
  }
