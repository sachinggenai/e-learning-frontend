/**
 * CourseService — typed CRUD operations for courses.
 *
 * Replaces legacy apiService course endpoints with the new httpClient.
 *
 * Endpoints:
 *   GET    /courses                    — list courses
 *   POST   /courses                    — create course
 *   GET    /courses/{courseId}          — get course
 *   PATCH  /courses/{courseId}          — update course
 *   PUT    /courses/{courseId}          — upsert course
 *   DELETE /courses/{courseId}          — delete course
 *   POST   /courses/{courseId}/export   — export (delegated to ExportService)
 */

import { httpClient } from "./httpClient";
import {
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseListResponse,
  CourseValidationResponse,
} from "../types/course";

class CourseService {
  /** List courses (paginated). */
  async listCourses(page = 1, limit = 20): Promise<CourseListResponse> {
    const { data } = await httpClient.get("/courses", {
      params: { page, limit },
    });

    // OpenAPI 3.1 now returns a plain array of CourseOut for GET /courses.
    // Keep the previous paginated shape for existing Redux consumers.
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length,
        page,
        limit,
      } as CourseListResponse;
    }

    if (Array.isArray(data?.items)) {
      return data as CourseListResponse;
    }

    if (Array.isArray(data?.courses)) {
      return {
        items: data.courses,
        total: Number(data.total ?? data.courses.length ?? 0),
        page: Number(data.page ?? page),
        limit: Number(data.limit ?? limit),
      } as CourseListResponse;
    }

    return {
      items: [],
      total: 0,
      page,
      limit,
    } as CourseListResponse;
  }

  /** Get a single course by ID (includes pages + components). */
  async getCourse(courseId: string): Promise<Course> {
    const { data } = await httpClient.get(`/courses/${courseId}`);
    return data;
  }

  /** Create a new course. Accepts both legacy templates[] and new pages[].components[] format. */
  async createCourse(request: CourseCreateRequest): Promise<Course> {
    const { data } = await httpClient.post("/courses", request);
    return data;
  }

  /** Partial update a course (title, author, settings, navigation, scoring, status). */
  async updateCourse(
    courseId: string,
    request: CourseUpdateRequest,
  ): Promise<Course> {
    const { data } = await httpClient.patch(`/courses/${courseId}`, request);
    return data;
  }

  /** Idempotent upsert: creates when absent, updates when present. */
  async upsertCourse(
    courseId: string,
    request: CourseCreateRequest,
  ): Promise<Course> {
    const { data } = await httpClient.put(`/courses/${courseId}`, request);

    // Latest OpenAPI documents 201 on create with no explicit response body.
    // Fallback to GET so callers still receive a Course object.
    if (data && Object.keys(data).length > 0) {
      return data;
    }

    return this.getCourse(courseId);
  }

  /** Delete a course. */
  async deleteCourse(courseId: string): Promise<void> {
    await httpClient.delete(`/courses/${courseId}`);
  }

  /**
   * Save a course using backend upsert (single PUT call).
   * This avoids PATCH->404->POST fallback noise and reduces race conditions.
   */
  async saveCourse(course: Course): Promise<Course> {
    return this.upsertCourse(course.courseId, {
      courseId: course.courseId,
      title: course.title,
      author: course.author,
      language: course.language,
      description: course.description,
      version: course.version,
      pages: course.pages?.map((p) => ({
        title: p.title,
        components: p.components?.map((c) => ({
          componentType: c.componentType,
          data: c.data,
          audioConfig: c.audioConfig,
          completionCriteria: c.completionCriteria,
          styling: c.styling,
        })),
        pageCompletion: p.pageCompletion,
        layout: p.layout,
        theme: p.theme,
      })),
      navigation: course.navigation,
      settings: course.settings,
      scoring: course.scoring ?? undefined,
    });
  }

  /** Validate course data without persisting. */
  async validateCourse(
    course: Course | CourseCreateRequest,
  ): Promise<CourseValidationResponse> {
    const { data } = await httpClient.post("/courses/validate", {
      courseData: course,
    });
    return data;
  }

  /** List available page templates for add-page flow. */
  async listAvailableTemplates(): Promise<any[]> {
    const { data } = await httpClient.get("/courses/templates/available");
    return data?.templates || [];
  }
}

export const courseService = new CourseService();
