package com.example.scorer.scoring

import com.example.scorer.model.*

object Constraints:

  def passesAll(mentor: MentorProfile, mentee: MenteeProfile): Boolean =
    hasCapacity(mentor) && notInReportingChain(mentor, mentee)

  def hasCapacity(mentor: MentorProfile): Boolean =
    mentor.currentMenteeCount < mentor.capacity

  def notInReportingChain(
    mentor: MentorProfile,
    mentee: MenteeProfile
  ): Boolean =
    !mentee.reportingChain.contains(mentor.userId)

  def filterMentors(
    mentors: List[MentorProfile],
    mentee: MenteeProfile
  ): List[MentorProfile] =
    mentors.filter(passesAll(_, mentee))
