/**
 * PageService — CRUD operations for pages within a course.
 *
 * Endpoints:
 *   GET    /courses/{courseId}/pages
 *   POST   /courses/{courseId}/pages
 *   GET    /courses/{courseId}/pages/{pageId}
 *   PATCH  /courses/{courseId}/pages/{pageId}
 *   DELETE /courses/{courseId}/pages/{pageId}
 *   POST   /courses/{courseId}/pages/reorder
 */

import { httpClient } from './httpClient';
import {
  Page,
  PageCreateRequest,
  PageUpdateRequest,
  ReorderRequest,
} from '../types/course';

class PageService {
  async listPages(courseId: string): Promise<Page[]> {
    const { data } = await httpClient.get(`/courses/${courseId}/pages`);
    return data;
  }

  async getPage(courseId: string, pageId: string): Promise<Page> {
    const { data } = await httpClient.get(`/courses/${courseId}/pages/${pageId}`);
    return data;
  }

  async createPage(courseId: string, request: PageCreateRequest): Promise<Page> {
    const { data } = await httpClient.post(`/courses/${courseId}/pages`, request);
    return data;
  }

  async updatePage(courseId: string, pageId: string, request: PageUpdateRequest): Promise<Page> {
    const { data } = await httpClient.patch(`/courses/${courseId}/pages/${pageId}`, request);
    return data;
  }

  async deletePage(courseId: string, pageId: string): Promise<void> {
    await httpClient.delete(`/courses/${courseId}/pages/${pageId}`);
  }

  async reorderPages(courseId: string, orderedIds: string[]): Promise<void> {
    await httpClient.post(`/courses/${courseId}/pages/reorder`, { orderedIds } as ReorderRequest);
  }
}

export const pageService = new PageService();
