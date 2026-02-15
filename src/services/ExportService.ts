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
  /** Trigger a generic export. Returns a download URL or export ID for polling. */
  async exportCourse(request: ExportRequest): Promise<ExportResponse> {
    const { data } = await httpClient.post('/export', request);
    return data;
  }

  /** Trigger a SCORM-specific export for a course. */
  async exportScorm(courseId: string, format: 'scorm_1_2' | 'scorm_2004' = 'scorm_1_2'): Promise<ExportResponse> {
    const { data } = await httpClient.post(`/export/scorm/${courseId}`, { format });
    return data;
  }

  /** Pre-validate a course for export without generating a ZIP. */
  async validateForExport(course: Course | string): Promise<CourseValidationResponse> {
    const payload = typeof course === 'string' ? { course } : { courseData: course };
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
