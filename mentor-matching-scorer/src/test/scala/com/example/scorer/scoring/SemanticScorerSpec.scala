package com.example.scorer.scoring

import munit.FunSuite

class SemanticScorerSpec extends FunSuite:

  test("identical vectors give 1.0") {
    val v = List(1.0, 0.0, 0.0)
    val s = SemanticScorer.cosineSimilarity(v, v)
    assert(s > 0.99)
  }

  test("one embedding missing returns None") {
    assertEquals(SemanticScorer.score(Some(List(1.0)), None), None)
    assertEquals(SemanticScorer.score(None, Some(List(1.0))), None)
  }

  test("orthogonal vectors give 0.5 (normalized from 0)") {
    val a = List(1.0, 0.0)
    val b = List(0.0, 1.0)
    val s = SemanticScorer.cosineSimilarity(a, b)
    assert(math.abs(s - 0.5) < 0.01)
  }

  test("opposite vectors give 0.0 (normalized from -1)") {
    val a = List(1.0, 0.0)
    val b = List(-1.0, 0.0)
    val s = SemanticScorer.cosineSimilarity(a, b)
    assert(s < 0.01)
  }

  test("empty vectors yield None") {
    assertEquals(SemanticScorer.score(Some(Nil), Some(Nil)), None)
  }

  test("both None returns None") {
    assertEquals(SemanticScorer.score(None, None), None)
  }
