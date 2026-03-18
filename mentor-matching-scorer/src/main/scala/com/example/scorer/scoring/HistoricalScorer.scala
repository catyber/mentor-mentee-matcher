package com.example.scorer.scoring

import com.example.scorer.model.{HistoricalSubWeights, Mentorship}

object HistoricalScorer:

  private val MinSampleSize = 3 // minimum mentorships required for statistical reliability
  private val ExpectedMeetings = 12.0 // assumption: target meetings per mentorship for full score

  def score(
    mentorships: List[Mentorship],
    subWeightsOpt: Option[HistoricalSubWeights] = None
  ): Option[Double] =
    if mentorships.size < MinSampleSize then None
    else Some(computeScore(mentorships, subWeightsOpt))

  private def computeScore(
    mentorships: List[Mentorship],
    subWeightsOpt: Option[HistoricalSubWeights]
  ): Double =
    val satisfactionScore = avgSatisfaction(mentorships)
    val retentionScore = retentionRate(mentorships)
    val meetingScore = meetingConsistency(mentorships)

    val w = subWeightsOpt.getOrElse(HistoricalSubWeights.default)
    val normalizer = w.satisfaction + w.retention + w.meeting
    (w.satisfaction * satisfactionScore +
      w.retention * retentionScore +
      w.meeting * meetingScore) / normalizer

  private def avgSatisfaction(mentorships: List[Mentorship]): Double =
    val rated = mentorships.flatMap(_.satisfaction)
    if rated.isEmpty then 0.5
    else (rated.sum.toDouble / rated.size - 1.0) / 4.0

  private def retentionRate(mentorships: List[Mentorship]): Double =
    val completed = mentorships.count(!_.endedEarly)
    completed.toDouble / mentorships.size

  private def meetingConsistency(mentorships: List[Mentorship]): Double =
    val avgMeetings = mentorships.map(_.meetingCount.toDouble).sum / mentorships.size
    math.min(avgMeetings / ExpectedMeetings, 1.0)
