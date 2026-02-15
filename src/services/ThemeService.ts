/**
 * ThemeService — Theme CRUD and resolution API client.
 *
 * Endpoints:
 *   GET    /themes                            — list themes
 *   POST   /themes                            — create theme
 *   GET    /themes/presets                     — list preset themes
 *   GET    /themes/{themeId}                   — get theme
 *   PATCH  /themes/{themeId}                   — update theme
 *   DELETE /themes/{themeId}                   — delete theme
 *   GET    /courses/{courseId}/theme           — get course theme
 *   PATCH  /courses/{courseId}/theme           — update course theme
 *   GET    /courses/{courseId}/pages/{pageId}/theme    — get page theme
 *   PATCH  /courses/{courseId}/pages/{pageId}/theme    — update page theme
 */

import { httpClient } from './httpClient';
import {
  Theme,
  ThemeOverrides,
  ResolvedThemeResponse,
} from '../types/course';

class ThemeService {
  // ─── Global Themes ───────────────────────────────────────────
  async listThemes(): Promise<Theme[]> {
    const { data } = await httpClient.get('/themes');
    return data;
  }

  async getPresets(): Promise<Theme[]> {
    const { data } = await httpClient.get('/themes/presets');
    return data;
  }

  async getTheme(themeId: string): Promise<Theme> {
    const { data } = await httpClient.get(`/themes/${themeId}`);
    return data;
  }

  async createTheme(theme: Partial<Theme>): Promise<Theme> {
    const { data } = await httpClient.post('/themes', theme);
    return data;
  }

  async updateTheme(themeId: string, updates: Partial<Theme>): Promise<Theme> {
    const { data } = await httpClient.patch(`/themes/${themeId}`, updates);
    return data;
  }

  async deleteTheme(themeId: string): Promise<void> {
    await httpClient.delete(`/themes/${themeId}`);
  }

  // ─── Course Theme ────────────────────────────────────────────
  async getCourseTheme(courseId: string): Promise<ResolvedThemeResponse> {
    const { data } = await httpClient.get(`/courses/${courseId}/theme`);
    return data;
  }

  async updateCourseTheme(courseId: string, overrides: ThemeOverrides): Promise<ResolvedThemeResponse> {
    const { data } = await httpClient.patch(`/courses/${courseId}/theme`, overrides);
    return data;
  }

  // ─── Page Theme ──────────────────────────────────────────────
  async getPageTheme(courseId: string, pageId: string): Promise<ResolvedThemeResponse> {
    const { data } = await httpClient.get(`/courses/${courseId}/pages/${pageId}/theme`);
    return data;
  }

  async updatePageTheme(courseId: string, pageId: string, overrides: ThemeOverrides): Promise<ResolvedThemeResponse> {
    const { data } = await httpClient.patch(`/courses/${courseId}/pages/${pageId}/theme`, overrides);
    return data;
  }
}

export const themeService = new ThemeService();
