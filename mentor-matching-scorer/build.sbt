val scala3Version = "3.3.3"

lazy val root = project
  .in(file("."))
  .settings(
    name := "mentor-matching-scorer",
    version := "0.1.0",
    scalaVersion := scala3Version,

    libraryDependencies ++= Seq(
      "org.http4s"      %% "http4s-ember-server" % "0.23.27",
      "org.http4s"      %% "http4s-circe"        % "0.23.27",
      "org.http4s"      %% "http4s-dsl"          % "0.23.27",
      "io.circe"        %% "circe-generic"       % "0.14.7",
      "io.circe"        %% "circe-parser"       % "0.14.7",
      "org.typelevel"   %% "cats-effect"         % "3.5.4",
      "ch.qos.logback"   % "logback-classic"     % "1.5.6",
      "org.scalameta"   %% "munit"               % "1.0.0"  % Test,
      "org.typelevel"   %% "munit-cats-effect"   % "2.0.0"  % Test,
    ),

    testFrameworks += new TestFramework("munit.Framework"),

    Compile / run / fork := true,

    assembly / assemblyMergeStrategy := {
      case PathList("META-INF", _*) => MergeStrategy.discard
      case x => MergeStrategy.first
    }
  )
