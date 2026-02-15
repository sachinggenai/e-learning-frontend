/**
 * RegistryService — Component Type Registry API client.
 *
 * Endpoints:
 *   GET /components                          — list all types
 *   GET /components/categories               — list categories
 *   GET /components/categories/{categoryId}  — get types in category
 *   GET /components/search?q=                — search types
 *   GET /components/{typeId}                 — get type detail
 */

import { httpClient } from './httpClient';
import {
  ComponentTypeSummary,
  ComponentTypeDetail,
  ComponentTypeListResponse,
  CategorySummary,
  CategoryListResponse,
} from '../types/course';

class RegistryService {
  async listTypes(params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ComponentTypeListResponse> {
    const { data } = await httpClient.get('/components', { params });
    return data;
  }

  async getType(typeId: string): Promise<ComponentTypeDetail> {
    const { data } = await httpClient.get(`/components/${typeId}`);
    return data;
  }

  async listCategories(): Promise<CategoryListResponse> {
    const { data } = await httpClient.get('/components/categories');
    return data;
  }

  async getCategory(categoryId: string): Promise<ComponentTypeSummary[]> {
    const { data } = await httpClient.get(`/components/categories/${categoryId}`);
    return data.items || data;
  }

  async search(query: string): Promise<ComponentTypeListResponse> {
    const { data } = await httpClient.get('/components/search', { params: { q: query } });
    return data;
  }
}

export const registryService = new RegistryService();
