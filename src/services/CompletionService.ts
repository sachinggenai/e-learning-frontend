/**
 * CompletionService — Completion tracking and status API client.
 *
 * Endpoints:
 *   GET  /courses/{courseId}/completion                 — course completion
 *   GET  /courses/{courseId}/pages/{pageId}/completion   — page completion
 *   POST /courses/{courseId}/pages/{pageId}/completion   — submit page completion
 *   GET  /courses/{courseId}/interactions                — list interactions
 *   POST /courses/{courseId}/interactions                — record interaction
 */

import { httpClient } from './httpClient';
import {
  CourseCompletionResponse,
  PageCompletionResponse,
  InteractionEvent,
} from '../types/course';

class CompletionService {
  async getCourseCompletion(courseId: string): Promise<CourseCompletionResponse> {
    const { data } = await httpClient.get(`/courses/${courseId}/completion`);
    return data;
  }

  async getPageCompletion(courseId: string, pageId: string): Promise<PageCompletionResponse> {
    const { data } = await httpClient.get(`/courses/${courseId}/pages/${pageId}/completion`);
    return data;
  }

  async submitPageCompletion(courseId: string, pageId: string): Promise<PageCompletionResponse> {
    const { data } = await httpClient.post(`/courses/${courseId}/pages/${pageId}/completion`, {});
    return data;
  }

  async recordInteraction(courseId: string, event: InteractionEvent): Promise<any> {
    const { data } = await httpClient.post(`/courses/${courseId}/interactions`, event);
    return data;
  }

  async listInteractions(courseId: string): Promise<any[]> {
    const { data } = await httpClient.get(`/courses/${courseId}/interactions`);
    return data;
  }
}

export const completionService = new CompletionService();
