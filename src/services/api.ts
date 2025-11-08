/**
 * API service layer for communicating with FastAPI backend
 * Implements all endpoints specified in Phase 1 requirements
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Course,
  CourseValidationResponse,
  ExportRequest,
  ExportResponse,
} from "../types/course";
import {
  transformCourseForBackend,
  transformCourseForExport,
} from "../utils/transform";

// API Configuration
// Resolution order: explicit REACT_APP_API_BASE > legacy REACT_APP_API_URL > default dev fallback
// CRITICAL: baseURL includes /api/v1 prefix, so request URLs should NOT include it
const API_BASE_URL =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000/api/v1"; // ✅ Fixed: Changed from 8000 to 8000 to match backend
if (process.env.NODE_ENV === "development") {
  // Surface which base URL is used for clarity during manual validation
  // eslint-disable-next-line no-console
  console.info("[api] Using API base:", API_BASE_URL);
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 seconds for file uploads/downloads
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        // Enhanced logging to show full URL being called
        const fullUrl = `${this.client.defaults.baseURL}${config.url}`;
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        console.log(`  Full URL: ${fullUrl}`);
        console.log(`  Base URL: ${this.client.defaults.baseURL}`);
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(
          "API Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
  }> {
    try {
      const response: AxiosResponse = await this.client.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw new Error("Backend service is unavailable");
    }
  }

  /**
   * Detailed health check with dependencies
   */
  async healthCheckDetailed(): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.get("/health/detailed");
      return response.data;
    } catch (error) {
      console.error("Detailed health check failed:", error);
      throw error;
    }
  }

  /**
   * Validate course data against schema
   */
  async validateCourse(
    courseData: Course | string
  ): Promise<CourseValidationResponse> {
    try {
      // Handle both raw course data and pre-transformed string
      let rawObject: any;
      if (typeof courseData === "string") {
        try {
          rawObject = JSON.parse(courseData);
        } catch {
          rawObject = {};
        }
      } else {
        rawObject = courseData;
      }
      const transformed = transformCourseForBackend(rawObject);
      const courseString = JSON.stringify(transformed);

      // Validate data structure before sending (development only)
      if (process.env.NODE_ENV === "development") {
        const parsedData = JSON.parse(courseString);
        console.log("🔍 API Validation - Course data structure check:");
        console.log(
          "   ✅ Navigation linearProgression:",
          !!parsedData.navigation?.linearProgression
        );
        console.log(
          "   ✅ Template content field:",
          !!parsedData.templates?.[0]?.data?.content
        );
        console.log("   ✅ Settings object:", !!parsedData.settings);
      }

      const backendRequest = {
        course: courseString,
      };

      const response: AxiosResponse<any> = await this.client.post(
        "/export/validate",
        backendRequest
      );

      // Transform backend response to match frontend interface
      const backendData = response.data;
      const validationBlock = backendData.validation || {};
      const errors = Array.isArray(validationBlock.errors)
        ? validationBlock.errors
        : [];
      return {
        valid: !!(validationBlock.valid ?? backendData.success),
        errors: errors.map((e: any) => ({
          field: e.field || "validation",
          message: e.message || JSON.stringify(e),
        })),
      };
    } catch (error: any) {
      console.error("Course validation failed:", error);

      // Handle validation errors from backend (422 status)
      if (error.response?.status === 422) {
        const raw = error.response.data;
        const detail = raw?.detail || [];
        const mapped = Array.isArray(detail)
          ? detail.map((d: any) => ({
              field: (d.loc && d.loc[d.loc.length - 1]) || "course",
              message: d.msg || "Validation error",
              type: d.type || "unknown",
            }))
          : [
              {
                field: "course",
                message: raw?.detail || "Validation error",
                type: "unknown",
              },
            ];
        // Return still matching CourseValidationResponse but we keep extra metadata for UI if needed
        return { valid: false, errors: mapped } as any;
      }

      throw new Error("Failed to validate course");
    }
  }

  /**
   * Save course (create or update)
   */
  async saveCourse(course: Course): Promise<any> {
    console.log("API Service - saveCourse: Starting save operation", {
      courseId: course.courseId,
      courseTitle: course.title,
      hasTempId: course.courseId?.startsWith("temp-"),
      templateCount: course.templates?.length || 0,
    });

    try {
      // Transform course data for backend
      console.log(
        "API Service - saveCourse: Transforming course data for backend"
      );
      const transformed = transformCourseForBackend(course);
      console.log("API Service - saveCourse: Data transformation complete", {
        transformedKeys: Object.keys(transformed),
        transformedTemplatesCount: transformed.templates?.length || 0,
      });

      // Determine if this is a create or update based on courseId format
      const isNewCourse =
        !course.courseId || course.courseId.startsWith("temp-");
      const method = isNewCourse ? "POST" : "PATCH";
      const url = isNewCourse ? "/courses" : `/courses/${course.courseId}`;

      console.log("API Service - saveCourse: Determined operation type", {
        isNewCourse,
        method,
        url,
        originalCourseId: course.courseId,
      });

      let response: AxiosResponse;

      try {
        console.log("API Service - saveCourse: Making API request", {
          method,
          url,
          requestDataSize: JSON.stringify(transformed).length,
        });

        response = await this.client.request({
          method,
          url,
          data: transformed,
        });

        console.log("API Service - saveCourse: API request successful", {
          status: response.status,
          responseDataKeys: Object.keys(response.data),
          returnedCourseId: response.data.courseId || response.data.id,
        });
      } catch (error: any) {
        console.error("API Service - saveCourse: Initial API request failed", {
          method,
          url,
          errorStatus: error.response?.status,
          errorData: error.response?.data,
          errorMessage: error.message,
          errorCode: error.code,
          errorName: error.name,
          hasResponse: !!error.response,
          fullError: error.response || error,
        });

        // If PATCH fails with "Course not found" OR network error, try creating the course instead
        const shouldFallbackToPost =
          method === "PATCH" &&
          (error.response?.status === 404 ||
            error.message?.includes("Course not found") ||
            !error.response); // Network error or no response - course likely doesn't exist

        console.log("API Service - saveCourse: Evaluating fallback", {
          method,
          shouldFallbackToPost,
          errorHasResponse: !!error.response,
          errorStatus: error.response?.status,
          errorMessage: error.message,
        });

        if (shouldFallbackToPost) {
          console.log(
            "API Service - saveCourse: Course not found (404), attempting POST fallback",
            {
              originalCourseId: course.courseId,
              fallbackMethod: "POST",
              fallbackUrl: "/courses",
              errorDetail: error.response?.data,
            }
          );

          try {
            response = await this.client.request({
              method: "POST",
              url: "/courses",
              data: transformed,
            });

            console.log("API Service - saveCourse: Fallback POST successful", {
              status: response.status,
              newCourseId: response.data.courseId || response.data.id,
            });
          } catch (fallbackError: any) {
            console.error(
              "API Service - saveCourse: Fallback POST also failed",
              {
                status: fallbackError.response?.status,
                errorData: fallbackError.response?.data,
                errorMessage: fallbackError.message,
              }
            );
            throw fallbackError;
          }
        } else {
          console.error("API Service - saveCourse: API request failed", {
            method,
            url,
            status: error.response?.status,
            errorMessage: error.response?.data?.error || error.message,
            fullError: error.response?.data || error,
          });
          throw error;
        }
      }

      const result = {
        success: true,
        course: response.data,
        isNew: isNewCourse,
      };

      console.log(
        "API Service - saveCourse: Operation completed successfully",
        {
          success: result.success,
          isNew: result.isNew,
          finalCourseId: result.course.courseId || result.course.id,
        }
      );

      return result;
    } catch (error: any) {
      console.error("API Service - saveCourse: Course save failed with error", {
        courseId: course.courseId,
        courseTitle: course.title,
        error: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });

      let errorMessage = "Failed to save course";

      // Handle structured error responses
      if (error.response?.data) {
        try {
          const parsed = error.response.data;
          if (parsed.detail) {
            if (Array.isArray(parsed.detail)) {
              errorMessage = parsed.detail.map((d: any) => d.msg).join("; ");
            } else if (typeof parsed.detail === "string") {
              errorMessage = parsed.detail;
            }
          } else if (parsed.message) {
            errorMessage = parsed.message;
          }
        } catch {
          // Fallback to default message
        }
      }

      const errorResult = {
        success: false,
        error: errorMessage,
      };

      console.log(
        "API Service - saveCourse: Returning error result",
        errorResult
      );

      return errorResult;
    }
  }

  /**
   * Export course as SCORM package
   */
  async exportCourse(exportRequest: ExportRequest): Promise<ExportResponse> {
    try {
      // Handle both raw course data and pre-transformed string
      let rawObject: any;
      if (typeof exportRequest.courseData === "string") {
        try {
          rawObject = JSON.parse(exportRequest.courseData);
        } catch {
          rawObject = {};
        }
      } else {
        rawObject = exportRequest.courseData;
      }
      const transformed = transformCourseForExport(rawObject);
      const courseString = JSON.stringify(transformed);

      console.log("Export: Transformed course data:", transformed);

      const backendRequest = {
        course: courseString,
      };

      const response: AxiosResponse = await this.client.post(
        "/export",
        backendRequest,
        {
          responseType: "blob", // For file download
        }
      );

      // Check if the response is actually an error (backend may return JSON for validation errors)
      if (response.status !== 200) {
        // Try to parse the blob as error JSON
        try {
          const text = await response.data.text();
          const errorData = JSON.parse(text);
          throw new Error(
            errorData.detail || `Export failed with status ${response.status}`
          );
        } catch (parseError) {
          throw new Error(`Export failed with status ${response.status}`);
        }
      }

      // Create download URL from blob
      const blob = new Blob([response.data], { type: "application/zip" });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Extract filename from content-disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "course-export.zip";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      console.log("Export: Success, filename:", filename);
      return {
        success: true,
        downloadUrl,
        filename,
      };
    } catch (error: any) {
      console.error("Course export failed:", error);
      let errorMessage = "Failed to export course";

      // Attempt to parse 400/422 structured detail
      if (error.response?.data) {
        try {
          if (error.response.data instanceof Blob) {
            const text = await error.response.data.text();
            const parsed = JSON.parse(text);
            console.error("Export error details:", parsed);

            if (parsed.detail) {
              if (Array.isArray(parsed.detail)) {
                errorMessage = parsed.detail.map((d: any) => d.msg).join("; ");
              } else if (typeof parsed.detail === "string") {
                errorMessage = parsed.detail;
              }
            } else if (parsed.message) {
              errorMessage = parsed.message;
            } else if (parsed.error) {
              errorMessage = Array.isArray(parsed.error)
                ? parsed.error.map((e: any) => e.msg || e.message).join("; ")
                : parsed.error;
            }
          } else if (typeof error.response.data === "object") {
            const parsed = error.response.data;
            console.error("Export error details:", parsed);

            if (parsed.detail) {
              if (Array.isArray(parsed.detail)) {
                errorMessage = parsed.detail.map((d: any) => d.msg).join("; ");
              } else if (typeof parsed.detail === "string") {
                errorMessage = parsed.detail;
              }
            } else if (parsed.message) {
              errorMessage = parsed.message;
            } else if (parsed.error) {
              errorMessage = Array.isArray(parsed.error)
                ? parsed.error.map((e: any) => e.msg || e.message).join("; ")
                : parsed.error;
            }
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          // Fallback to default message
        }
      }

      console.error("Final export error message:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get available export formats
   */
  async getExportFormats(): Promise<string[]> {
    try {
      const response: AxiosResponse<{ formats: string[] }> =
        await this.client.get("/export/formats");
      return response.data.formats;
    } catch (error) {
      console.error("Failed to get export formats:", error);
      return ["scorm"]; // Default fallback
    }
  }

  /**
   * Upload asset file
   */
  async uploadAsset(file: File): Promise<{ id: string; url: string }> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response: AxiosResponse = await this.client.post(
        "/assets/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Asset upload failed:", error);
      throw new Error("Failed to upload asset");
    }
  }

  /**
   * Delete asset
   */
  async deleteAsset(assetId: string): Promise<void> {
    try {
      await this.client.delete(`/assets/${assetId}`);
    } catch (error) {
      console.error("Asset deletion failed:", error);
      throw new Error("Failed to delete asset");
    }
  }

  /**
   * Enhanced Template Management
   */

  /**
   * Create a custom enhanced template
   */
  async createEnhancedTemplate(template: any): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.post(
        "/enhanced_templates",
        template
      );
      return response.data;
    } catch (error) {
      console.error("Enhanced template creation failed:", error);
      throw new Error("Failed to create enhanced template");
    }
  }

  /**
   * Get all enhanced templates
   */
  async getEnhancedTemplates(): Promise<any[]> {
    try {
      const response: AxiosResponse = await this.client.get(
        "/enhanced_templates"
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch enhanced templates:", error);
      throw new Error("Failed to fetch enhanced templates");
    }
  }

  /**
   * Get enhanced template by ID
   */
  async getEnhancedTemplate(templateId: string): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.get(
        `/enhanced_templates/${templateId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch enhanced template:", error);
      throw new Error("Failed to fetch enhanced template");
    }
  }

  /**
   * Update enhanced template
   */
  async updateEnhancedTemplate(
    templateId: string,
    updates: Partial<any>
  ): Promise<any> {
    try {
      const response: AxiosResponse = await this.client.put(
        `/enhanced_templates/${templateId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error("Enhanced template update failed:", error);
      throw new Error("Failed to update enhanced template");
    }
  }

  /**
   * Delete enhanced template
   */
  async deleteEnhancedTemplate(templateId: string): Promise<void> {
    try {
      await this.client.delete(`/enhanced_templates/${templateId}`);
    } catch (error) {
      console.error("Enhanced template deletion failed:", error);
      throw new Error("Failed to delete enhanced template");
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
