/**
 * ExportService — SCORM export, validation, and status tracking.
 *
 * Endpoints:
 *   POST   /export                — trigger export (generic)
 *   POST   /export/validate       — pre-validate without generating ZIP
 *   GET    /export/formats        — list available export formats
 *   GET    /export/status/{id}    — check export progress
 *   POST   /export/scorm/{id}     — trigger SCORM-specific export
 */

import { httpClient } from './httpClient';
import {
  Course,
  ExportRequest,
  ExportResponse,
  ExportStatusResponse,
  CourseValidationResponse,
} from '../types/course';

export interface ExportFormat {
  formatId: string;
  name: string;
  description: string;
  version?: string;
}

export interface ExportFormatsResponse {
  formats: ExportFormat[];
}

class ExportService {
  private getFileNameFromDisposition(contentDisposition?: string, fallback = 'course_scorm.zip'): string {
    if (!contentDisposition) return fallback;

    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1]);

    const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i);
    if (quotedMatch?.[1]) return quotedMatch[1];

    const plainMatch = contentDisposition.match(/filename=([^;]+)/i);
    if (plainMatch?.[1]) return plainMatch[1].trim();

    return fallback;
  }

  private async extractBlobErrorMessage(raw: unknown, fallback: string): Promise<string> {
    try {
      if (typeof Blob !== 'undefined' && raw instanceof Blob) {
        const text = await raw.text();
        if (!text) return fallback;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed?.detail)) {
          return parsed.detail
            .map((d: any) => d?.msg || d?.message || JSON.stringify(d))
            .join('; ');
        }
        return parsed?.detail || parsed?.message || fallback;
      }
    } catch {
      // Keep fallback message when blob/json parsing fails.
    }
    return fallback;
  }

  private async parseJsonBlob(raw: unknown): Promise<any | null> {
    try {
      if (typeof Blob === 'undefined' || !(raw instanceof Blob)) return null;
      const text = await raw.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  /** Trigger a generic export. Returns a download URL or export ID for polling. */
  async exportCourse(request: ExportRequest): Promise<ExportResponse> {
    const courseString =
      typeof request.courseData === 'string'
        ? request.courseData
        : JSON.stringify(request.courseData);
    const { data } = await httpClient.post('/export', { course: courseString });
    return data;
  }

  /** Trigger a SCORM-specific export for a course. */
  async exportScorm(courseId: string, format: 'scorm_1_2' | 'scorm_2004' = 'scorm_1_2'): Promise<ExportResponse> {
    try {
      const requestConfig = {
        responseType: 'blob' as const,
        headers: {
          Accept: 'application/zip, application/json',
        },
      };

      let response;

      try {
        // Primary contract: send format as JSON body.
        response = await httpClient.post(`/export/scorm/${courseId}`, { format }, requestConfig);
      } catch (primaryError: any) {
        // Compatibility fallback for servers expecting query params.
        const fallbackEligible = primaryError?.status === 400 || primaryError?.status === 404 || primaryError?.status === 422;
        if (!fallbackEligible) throw primaryError;

        response = await httpClient.post(`/export/scorm/${courseId}`, undefined, {
          ...requestConfig,
          params: { format },
        });
      }

      const contentType = String(response.headers?.['content-type'] || '').toLowerCase();
      if (contentType.includes('application/json')) {
        const parsed = await this.parseJsonBlob(response.data);
        if (!parsed) {
          return {
            success: false,
            error: 'Export returned JSON response that could not be parsed',
          };
        }

        if (parsed.success === false) {
          return {
            success: false,
            error: parsed.error || parsed.message || 'SCORM export failed',
          };
        }

        if (parsed.downloadUrl) {
          return {
            success: true,
            downloadUrl: parsed.downloadUrl,
            fileName: parsed.fileName || `${courseId}_${format}.zip`,
          };
        }

        return {
          success: false,
          error: parsed.message || 'SCORM export did not return a downloadable file',
        };
      }

      const blob = response.data as Blob;
      if (!blob || blob.size === 0) {
        throw new Error('Export returned an empty file');
      }

      const contentDisposition = response.headers?.['content-disposition'] as string | undefined;
      const fileName = this.getFileNameFromDisposition(contentDisposition, `${courseId}_${format}.zip`);
      const downloadUrl = window.URL.createObjectURL(blob);

      return {
        success: true,
        downloadUrl,
        fileName,
      };
    } catch (error: any) {
      const status = error?.status;
      const fallback = error?.message || `SCORM export failed${status ? ` (${status})` : ''}`;
      const detailedMessage = await this.extractBlobErrorMessage(error?.raw, fallback);
      return {
        success: false,
        error: detailedMessage,
      };
    }
  }

  /** Pre-validate a course for export without generating a ZIP. */
  async validateForExport(course: Course | string): Promise<CourseValidationResponse> {
    const payload = {
      course: typeof course === 'string' ? course : JSON.stringify(course),
    };
    const { data } = await httpClient.post('/export/validate', payload);
    return data;
  }

  /** Get available export formats. */
  async getFormats(): Promise<ExportFormatsResponse> {
    const { data } = await httpClient.get('/export/formats');
    return data;
  }

  /** Check export progress (for large courses). */
  async getExportStatus(exportId: string): Promise<ExportStatusResponse> {
    const { data } = await httpClient.get(`/export/status/${exportId}`);
    return data;
  }

  /**
   * Poll export status until completion or failure.
   * @param exportId - The export job ID
   * @param intervalMs - Polling interval in milliseconds (default 2000)
   * @param timeoutMs - Max time to wait in milliseconds (default 120000)
   */
  async pollExportStatus(
    exportId: string,
    intervalMs = 2000,
    timeoutMs = 120_000,
  ): Promise<ExportStatusResponse> {
    const start = Date.now();

    return new Promise((resolve, reject) => {
      const check = async () => {
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Export timed out after ${timeoutMs}ms`));
          return;
        }

        try {
          const status = await this.getExportStatus(exportId);

          if (status.status === 'completed' || status.status === 'failed') {
            resolve(status);
            return;
          }

          setTimeout(check, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      check();
    });
  }

  /** Download the exported file. Returns a blob for saving. */
  async downloadExport(downloadUrl: string): Promise<Blob> {
    const { data } = await httpClient.get(downloadUrl, {
      responseType: 'blob',
    });
    return data;
  }
}

export const exportService = new ExportService();
