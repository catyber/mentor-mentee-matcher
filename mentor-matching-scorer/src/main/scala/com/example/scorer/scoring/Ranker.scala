package com.example.scorer.scoring

import com.example.scorer.model.*

object Ranker:

  def rank(request: RankRequest): RankResponse =
    val mentee = request.mentee
    val weights = request.weights.getOrElse(ScoringWeights.default)
    val topN = request.topN.getOrElse(5)

    val eligibleMentors = Constraints.filterMentors(request.mentors, mentee)

    val subWeightsOpt = weights.structuredSubWeights
    val scoredMentors = eligibleMentors.map { mentor =>
      val (structuredScore, structuredDetail) =
        StructuredScorer.score(mentor, mentee, subWeightsOpt)

      val semanticOpt =
        SemanticScorer.score(mentor.bioEmbedding, mentee.goalsEmbedding)

      val historicalOpt =
        HistoricalScorer.score(mentor.pastMentorships, weights.historicalSubWeights)

      val (finalScore, breakdown) = combineScores(
        structuredScore, structuredDetail,
        semanticOpt, historicalOpt, weights
      )

      RankedMentor(mentor.userId, totalScore = finalScore, breakdown)
    }

    val sorted = scoredMentors.sortBy(-_.totalScore).take(topN)

    RankResponse(mentee.userId, sorted)

  private def combineScores(
    structuredScore: Double,
    structuredDetail: StructuredDetail,
    semanticOpt: Option[Double],
    historicalOpt: Option[Double],
    weights: ScoringWeights
  ): (Double, ScoreBreakdown) =
    val semWeight = if semanticOpt.isDefined then weights.semantic else 0.0
    val histWeight = if historicalOpt.isDefined then weights.historical else 0.0
    val strWeight = weights.structured

    val totalWeight = strWeight + semWeight + histWeight
    if totalWeight == 0.0 then
      (0.0, ScoreBreakdown(structuredScore, 0.0, 0.0, structuredDetail))
    else
      val semScore = semanticOpt.getOrElse(0.0)
      val histScore = historicalOpt.getOrElse(0.0)

      val finalScore =
        (strWeight * structuredScore +
         semWeight * semScore +
         histWeight * histScore) / totalWeight

      val breakdown = ScoreBreakdown(structuredScore, semScore, histScore, structuredDetail)
      (finalScore, breakdown)
