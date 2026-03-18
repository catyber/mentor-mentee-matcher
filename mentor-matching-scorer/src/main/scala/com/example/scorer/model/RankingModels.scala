package com.example.scorer.model

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

case class StructuredSubWeights(
  timezone: Double,
  language: Double,
  skills: Double,
  experienceGap: Double,
  capacitySlack: Double
)

object StructuredSubWeights:
  given Decoder[StructuredSubWeights] = deriveDecoder
  given Encoder[StructuredSubWeights] = deriveEncoder

  val default: StructuredSubWeights = StructuredSubWeights(
    timezone = 0.15,
    language = 0.20,
    skills = 0.30,
    experienceGap = 0.10,
    capacitySlack = 0.05
  )

case class HistoricalSubWeights(
  satisfaction: Double,
  retention: Double,
  meeting: Double
)

object HistoricalSubWeights:
  given Decoder[HistoricalSubWeights] = deriveDecoder
  given Encoder[HistoricalSubWeights] = deriveEncoder

  val default: HistoricalSubWeights = HistoricalSubWeights(
    satisfaction = 0.50,
    retention = 0.30,
    meeting = 0.20
  )

case class ScoringWeights(
  structured: Double,
  semantic: Double,
  historical: Double,
  structuredSubWeights: Option[StructuredSubWeights] = None,
  historicalSubWeights: Option[HistoricalSubWeights] = None
)

object ScoringWeights:
  given Decoder[ScoringWeights] = deriveDecoder
  given Encoder[ScoringWeights] = deriveEncoder

  val default: ScoringWeights = ScoringWeights(
    structured = 0.50,
    semantic = 0.30,
    historical = 0.20,
    structuredSubWeights = None,
    historicalSubWeights = None
  )

case class RankRequest(
  mentee: MenteeProfile,
  mentors: List[MentorProfile],
  weights: Option[ScoringWeights],
  topN: Option[Int]
)

object RankRequest:
  given Decoder[RankRequest] = deriveDecoder

case class StructuredDetail(
  timezoneScore: Double,
  languageScore: Double,
  skillsScore: Double,
  experienceGapScore: Double,
  capacitySlackScore: Double
)

object StructuredDetail:
  given Encoder[StructuredDetail] = deriveEncoder

case class ScoreBreakdown(
  structured: Double,
  semantic: Double,
  historical: Double,
  structuredDetail: StructuredDetail
)

object ScoreBreakdown:
  given Encoder[ScoreBreakdown] = deriveEncoder

case class RankedMentor(
  mentorUserId: String,
  totalScore: Double,
  breakdown: ScoreBreakdown
)

object RankedMentor:
  given Encoder[RankedMentor] = deriveEncoder

case class RankResponse(
  menteeUserId: String,
  rankings: List[RankedMentor]
)

object RankResponse:
  given Encoder[RankResponse] = deriveEncoder
