package com.example.scorer.api

import cats.effect.IO
import org.http4s.*
import org.http4s.dsl.io.*
import org.http4s.circe.*
import io.circe.syntax.*
import com.example.scorer.model.*
import com.example.scorer.scoring.Ranker

object Routes:

  given EntityDecoder[IO, RankRequest] = jsonOf[IO, RankRequest]

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {

    case GET -> Root / "health" =>
      Ok("""{"status":"ok"}""")

    case req @ POST -> Root / "rank" =>
      req.as[RankRequest].attempt.flatMap {
        case Right(rankReq) =>
          val response = Ranker.rank(rankReq)
          Ok(response.asJson)
        case Left(err) =>
          BadRequest(s"""{"error":"Invalid request: ${err.getMessage}"}""")
      }
  }
