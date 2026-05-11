/**
 * ScoringService — Scoring configuration and calculation API client.
 *
 * Endpoints:
 *   GET   /courses/{courseId}/scoring           — get scoring config
 *   PATCH /courses/{courseId}/scoring           — update scoring config
 *   POST  /courses/{courseId}/scoring/validate  — validate scoring config
 *   POST  /courses/{courseId}/scoring/calculate — calculate scores
 */

import { httpClient } from "./httpClient";
import {
  ScoringConfig,
  ScoreCalculateRequest,
  ScoreCalculateResponse,
} from "../types/course";

class ScoringService {
  async getScoringConfig(courseId: string): Promise<ScoringConfig> {
    const { data } = await httpClient.get(`/courses/${courseId}/scoring`);
    return data;
  }

  async updateScoringConfig(
    courseId: string,
    config: Partial<ScoringConfig>,
  ): Promise<ScoringConfig> {
    const { data } = await httpClient.patch(
      `/courses/${courseId}/scoring`,
      config,
    );
    return data;
  }

  async validateScoringConfig(
    courseId: string,
  ): Promise<{ valid: boolean; errors: any[] }> {
    const { data } = await httpClient.post(
      `/courses/${courseId}/scoring/validate`,
      {},
    );
    return data;
  }

  async calculateScore(
    courseId: string,
    request: ScoreCalculateRequest,
  ): Promise<ScoreCalculateResponse> {
    const { data } = await httpClient.post(
      `/courses/${courseId}/scoring/calculate`,
      request,
    );
    return data;
  }
}

export const scoringService = new ScoringService();
