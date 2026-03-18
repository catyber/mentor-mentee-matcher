import axios from "axios";
import type { RankRequest, RankResponse } from "../types/index.js";

const SCORER_URL = process.env.SCALA_SCORER_URL || "http://localhost:8081";

export async function callScorer(request: RankRequest): Promise<RankResponse> {
  const response = await axios.post<RankResponse>(
    `${SCORER_URL}/rank`,
    request,
    { headers: { "Content-Type": "application/json" }, timeout: 10000 }
  );
  return response.data;
}
