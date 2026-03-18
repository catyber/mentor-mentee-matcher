package com.example.scorer

import cats.effect.*
import com.comcast.ip4s.*
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Router

object Main extends IOApp.Simple:

  val run: IO[Unit] =
    EmberServerBuilder
      .default[IO]
      .withHost(host"0.0.0.0")
      .withPort(port"8081")
      .withHttpApp(
        Router("/" -> api.Routes.routes)
          .orNotFound
      )
      .build
      .useForever
