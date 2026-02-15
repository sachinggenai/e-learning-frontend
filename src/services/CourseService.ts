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
 *   DELETE /courses/{courseId}          — delete course
 *   POST   /courses/{courseId}/export   — export (delegated to ExportService)
 */

import { httpClient } from './httpClient';
import {
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseListResponse,
  CourseValidationResponse,
} from '../types/course';

class CourseService {
  /** List courses (paginated). */
  async listCourses(page = 1, limit = 20): Promise<CourseListResponse> {
    const { data } = await httpClient.get('/courses', {
      params: { page, limit },
    });
    return data;
  }

  /** Get a single course by ID (includes pages + components). */
  async getCourse(courseId: string): Promise<Course> {
    const { data } = await httpClient.get(`/courses/${courseId}`);
    return data;
  }

  /** Create a new course. Accepts both legacy templates[] and new pages[].components[] format. */
  async createCourse(request: CourseCreateRequest): Promise<Course> {
    const { data } = await httpClient.post('/courses', request);
    return data;
  }

  /** Partial update a course (title, author, settings, navigation, scoring, status). */
  async updateCourse(courseId: string, request: CourseUpdateRequest): Promise<Course> {
    const { data } = await httpClient.patch(`/courses/${courseId}`, request);
    return data;
  }

  /** Delete a course. */
  async deleteCourse(courseId: string): Promise<void> {
    await httpClient.delete(`/courses/${courseId}`);
  }

  /**
   * Save a course — creates if new, updates if existing.
   * This is a convenience wrapper that mirrors the legacy apiService.saveCourse() behaviour.
   */
  async saveCourse(course: Course): Promise<Course> {
    try {
      // Try PATCH first (update existing)
      return await this.updateCourse(course.courseId, {
        title: course.title,
        author: course.author,
        language: course.language,
        description: course.description,
        version: course.version,
        navigation: course.navigation,
        settings: course.settings,
        scoring: course.scoring ?? undefined,
        status: course.status,
      });
    } catch (error: any) {
      // If 404, course doesn't exist yet — create it
      if (error.status === 404) {
        return this.createCourse({
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
      throw error;
    }
  }

  /** Validate course data without persisting. */
  async validateCourse(course: Course | CourseCreateRequest): Promise<CourseValidationResponse> {
    const { data } = await httpClient.post('/export/validate', course);
    return data;
  }
}

export const courseService = new CourseService();
