package com.example.scorer.scoring

import com.example.scorer.model.*
import java.time.ZoneId
import java.time.ZonedDateTime

object StructuredScorer:

  def score(
    mentor: MentorProfile,
    mentee: MenteeProfile,
    subWeightsOpt: Option[StructuredSubWeights] = None
  ): (Double, StructuredDetail) =
    val subWeights = subWeightsOpt.getOrElse(StructuredSubWeights.default)

    val tz   = timezoneScore(mentor.timezone, mentee.timezone)
    val lang = languageScore(mentor.languages, mentee.languages)
    val sk   = skillsScore(mentor.skills, mentee.desiredSkills)
    val exp  = experienceGapScore(mentor.yearsExperience, mentee.yearsExperience)
    val cap  = capacitySlackScore(mentor.capacity, mentor.currentMenteeCount)

    val total =
      subWeights.timezone       * tz +
      subWeights.language       * lang +
      subWeights.skills         * sk +
      subWeights.experienceGap  * exp +
      subWeights.capacitySlack  * cap

    val normalizer =
      subWeights.timezone + subWeights.language + subWeights.skills +
      subWeights.experienceGap + subWeights.capacitySlack

    val detail = StructuredDetail(tz, lang, sk, exp, cap)
    (total / normalizer, detail)

  def timezoneScore(mentorTz: String, menteeTz: String): Double =
    try
      val now = ZonedDateTime.now()
      val mentorOffset = now.withZoneSameInstant(ZoneId.of(mentorTz)).getOffset.getTotalSeconds
      val menteeOffset = now.withZoneSameInstant(ZoneId.of(menteeTz)).getOffset.getTotalSeconds
      val diffHours = math.abs(mentorOffset - menteeOffset) / 3600.0
      math.max(0.0, 1.0 - diffHours / 12.0)
    catch
      case _: Exception => 0.5

  def languageScore(
    mentorLangs: List[String],
    menteeLangs: List[String]
  ): Double =
    if menteeLangs.isEmpty then 1.0
    else
      val mentorLangSet = mentorLangs.map(_.toUpperCase).toSet
      val menteeLangSet = menteeLangs.map(_.toUpperCase).toSet
      menteeLangSet.count(mentorLangSet.contains).toDouble / menteeLangSet.size

  def skillsScore(
    mentorSkills: List[String],
    desiredSkills: List[String]
  ): Double =
    if desiredSkills.isEmpty then 1.0
    else
      val mentorSet = mentorSkills.map(_.toLowerCase).toSet
      val desiredSet = desiredSkills.map(_.toLowerCase).toSet
      val intersection = mentorSet.intersect(desiredSet).size.toDouble
      val union = mentorSet.union(desiredSet).size.toDouble
      if union == 0 then 0.0 else intersection / union

  def experienceGapScore(
    mentorYears: Int,
    menteeYears: Int
  ): Double =
    val gap = mentorYears - menteeYears
    if gap <= 0 then 0.0
    else if gap <= 2 then 0.4
    else if gap <= 8 then 1.0
    else if gap <= 15 then 0.7
    else 0.5

  def capacitySlackScore(
    capacity: Int,
    currentMenteeCount: Int
  ): Double =
    val slack = capacity - currentMenteeCount
    if slack <= 0 then 0.0
    else math.min(slack.toDouble / 3.0, 1.0)
