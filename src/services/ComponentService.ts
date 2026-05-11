/**
 * ComponentService — CRUD operations for components within a page.
 *
 * Endpoints:
 *   GET    /courses/{courseId}/pages/{pageId}/components
 *   POST   /courses/{courseId}/pages/{pageId}/components
 *   GET    /courses/{courseId}/pages/{pageId}/components/{componentId}
 *   PATCH  /courses/{courseId}/pages/{pageId}/components/{componentId}
 *   DELETE /courses/{courseId}/pages/{pageId}/components/{componentId}
 *   POST   /courses/{courseId}/pages/{pageId}/components/reorder
 */

import { httpClient } from "./httpClient";
import {
  Component,
  ComponentCreateRequest,
  ComponentUpdateRequest,
  ReorderRequest,
} from "../types/course";

class ComponentService {
  private basePath(courseId: string, pageId: string) {
    return `/courses/${courseId}/pages/${pageId}/components`;
  }

  async listComponents(courseId: string, pageId: string): Promise<Component[]> {
    const { data } = await httpClient.get(this.basePath(courseId, pageId));

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.components)) return data.components;
    return [];
  }

  async getComponent(
    courseId: string,
    pageId: string,
    componentId: string,
  ): Promise<Component> {
    const { data } = await httpClient.get(
      `${this.basePath(courseId, pageId)}/${componentId}`,
    );
    return (data?.component ?? data) as Component;
  }

  async addComponent(
    courseId: string,
    pageId: string,
    request: ComponentCreateRequest,
  ): Promise<Component> {
    const { data } = await httpClient.post(
      this.basePath(courseId, pageId),
      request,
    );
    return (data?.component ?? data) as Component;
  }

  async updateComponent(
    courseId: string,
    pageId: string,
    componentId: string,
    request: ComponentUpdateRequest,
  ): Promise<Component> {
    const { data } = await httpClient.patch(
      `${this.basePath(courseId, pageId)}/${componentId}`,
      request,
    );
    return (data?.component ?? data) as Component;
  }

  async deleteComponent(
    courseId: string,
    pageId: string,
    componentId: string,
  ): Promise<void> {
    await httpClient.delete(
      `${this.basePath(courseId, pageId)}/${componentId}`,
    );
  }

  async reorderComponents(
    courseId: string,
    pageId: string,
    orderedIds: string[],
  ): Promise<void> {
    await httpClient.post(`${this.basePath(courseId, pageId)}/reorder`, {
      orderedIds,
    } as ReorderRequest);
  }
}

export const componentService = new ComponentService();
