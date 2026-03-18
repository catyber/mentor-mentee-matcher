package com.example.scorer.model

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.*

case class MentorProfile(
  userId: String,
  timezone: String,
  languages: List[String],
  skills: List[String],
  yearsExperience: Int,
  capacity: Int,
  currentMenteeCount: Int,
  bioText: Option[String],
  bioEmbedding: Option[List[Double]],
  pastMentorships: List[Mentorship]
)

object MentorProfile:
  given Decoder[MentorProfile] = deriveDecoder
  given Encoder[MentorProfile] = deriveEncoder

case class MenteeProfile(
  userId: String,
  timezone: String,
  languages: List[String],
  desiredSkills: List[String],
  yearsExperience: Int,
  goalsText: Option[String],
  goalsEmbedding: Option[List[Double]],
  reportingChain: List[String]
)

object MenteeProfile:
  given Decoder[MenteeProfile] = deriveDecoder
  given Encoder[MenteeProfile] = deriveEncoder

case class Mentorship(
  id: String,
  mentorUserId: String,
  menteeUserId: String,
  satisfaction: Option[Int],
  meetingCount: Int,
  endedEarly: Boolean
)

object Mentorship:
  given Decoder[Mentorship] = deriveDecoder
  given Encoder[Mentorship] = deriveEncoder
