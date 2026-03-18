package com.example.scorer.scoring

object SemanticScorer:

  def score(
    mentorEmbedding: Option[List[Double]],
    menteeEmbedding: Option[List[Double]]
  ): Option[Double] =
    for
      mVec <- mentorEmbedding
      eVec <- menteeEmbedding
      if mVec.size == eVec.size && mVec.nonEmpty
    yield cosineSimilarity(mVec, eVec)

  def cosineSimilarity(a: List[Double], b: List[Double]): Double =
    val dotProduct = a.zip(b).map((x, y) => x * y).sum
    val normA = math.sqrt(a.map(x => x * x).sum)
    val normB = math.sqrt(b.map(x => x * x).sum)
    if normA == 0.0 || normB == 0.0 then 0.0
    else
      val sim = dotProduct / (normA * normB)
      (sim + 1.0) / 2.0
