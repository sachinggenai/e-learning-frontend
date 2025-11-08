/**
 * MediaUpload Component - Production-ready media upload with drag-and-drop
 *
 * Features:
 * - Drag and drop file upload
 * - File type validation (images, videos, audio, documents)
 * - Progress indicator
 * - Error handling and validation
 * - Integration with backend media API
 * - Thumbnail preview for images
 * - File size validation (50MB limit)
 */

import {
  AlertCircle,
  CheckCircle,
  FileText,
  Image,
  Music,
  Upload,
  Video,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { t } from "../i18n/strings";
import logger from "../utils/logger";

// Types
interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  /**
   * displayProgress is a smoothed/animated version of raw progress used for UI rendering
   * to avoid large visual jumps when the underlying XHR emits sparse progress events.
   */
  displayProgress?: number;
  status: "pending" | "uploading" | "success" | "error";
  errorMessage?: string;
  url?: string;
  thumbnail?: string;
}

interface MediaUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void;
  onClose?: () => void;
  courseId?: number;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  maxFiles?: number;
}

// Utility functions
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return <Image className="w-6 h-6" />;
  if (fileType.startsWith("video/")) return <Video className="w-6 h-6" />;
  if (fileType.startsWith("audio/")) return <Music className="w-6 h-6" />;
  return <FileText className="w-6 h-6" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const createThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Create thumbnail (100x100)
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        const scale = Math.min(size / img.width, size / img.height);
        const x = size / 2 - (img.width / 2) * scale;
        const y = size / 2 - (img.height / 2) * scale;

        ctx?.drawImage(img, x, y, img.width * scale, img.height * scale);
        resolve(canvas.toDataURL());
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const MediaUpload: React.FC<MediaUploadProps> = ({
  onUploadComplete,
  onClose,
  courseId,
  acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/mov",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "application/pdf",
    "text/plain",
  ],
  maxFileSize = 50, // 50MB
  maxFiles = 10,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [aggregateProgress, setAggregateProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);
  const visualProgressRef = useRef<number>(0);

  // Validation
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Accepted types: ${acceptedTypes.join(", ")}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${maxFileSize}MB)`;
    }

    return null;
  };

  // File processing
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const newFiles: UploadedFile[] = [];
      const fileArray = Array.from(fileList);

      // Check total file count
      if (files.length + fileArray.length > maxFiles) {
        alert(
          `Maximum ${maxFiles} files allowed. Current: ${files.length}, Adding: ${fileArray.length}`,
        );
        return;
      }

      for (const file of fileArray) {
        const validationError = validateFile(file);
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const uploadedFile: UploadedFile = {
          id: fileId,
          file,
          progress: 0,
          displayProgress: 0,
          status: validationError ? "error" : "pending",
          errorMessage: validationError || undefined,
        };

        // Create thumbnail for images
        if (file.type.startsWith("image/") && !validationError) {
          try {
            uploadedFile.thumbnail = await createThumbnail(file);
            logger.debug({
              event: "media.thumbnail.created",
              context: { file: file.name },
            });
          } catch (error) {
            console.warn("Failed to create thumbnail:", error);
            logger.warn({
              event: "media.thumbnail.error",
              message: "Thumbnail creation failed",
              error,
            });
          }
        }

        newFiles.push(uploadedFile);
      }

      setFiles((prev) => [...prev, ...newFiles]);
    },
    [files.length, maxFiles, acceptedTypes, maxFileSize],
  );

  // Upload functionality
  const uploadFile = async (fileData: UploadedFile): Promise<void> => {
    const formData = new FormData();
    formData.append("file", fileData.file);

    if (courseId) {
      formData.append("course_id", courseId.toString());
    }

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id
                  ? { ...f, progress, status: "uploading" }
                  : f,
              ),
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileData.id
                    ? {
                        ...f,
                        progress: 100,
                        displayProgress: Math.max(f.displayProgress || 0, 100),
                        status: "success",
                        url: response.url,
                      }
                    : f,
                ),
              );
              logger.info({
                event: "media.upload.success",
                message: "File uploaded",
                context: { file: fileData.file.name, id: fileData.id },
              });
              resolve();
            } catch (error) {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileData.id
                    ? {
                        ...f,
                        status: "error",
                        errorMessage: "Invalid server response",
                      }
                    : f,
                ),
              );
              logger.error({
                event: "media.upload.parse_error",
                message: "Invalid server response",
                error,
              });
              reject(error);
            }
          } else {
            let errorMessage = `Upload failed (${xhr.status})`;
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              errorMessage = errorResponse.detail || errorMessage;
            } catch {
              // Use default error message
            }

            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id
                  ? { ...f, status: "error", errorMessage }
                  : f,
              ),
            );
            const err = new Error(errorMessage);
            logger.error({
              event: "media.upload.error",
              message: errorMessage,
              error: err,
              context: { file: fileData.file.name },
            });
            reject(err);
          }
        });

        xhr.addEventListener("error", () => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id
                ? {
                    ...f,
                    status: "error",
                    errorMessage: "Network error during upload",
                  }
                : f,
            ),
          );
          const err = new Error("Network error");
          logger.error({
            event: "media.upload.network_error",
            message: "Network error during upload",
            error: err,
            context: { file: fileData.file.name },
          });
          reject(err);
        });

        xhr.open("POST", "/api/v1/media/upload");
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Upload error:", error);
      logger.error({
        event: "media.upload.exception",
        message: "Unhandled upload exception",
        error,
      });
      throw error;
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);

    const pendingFiles = files.filter((f) => f.status === "pending");

    try {
      await Promise.all(pendingFiles.map(uploadFile));

      // Notify completion
      const successfulFiles = files.filter((f) => f.status === "success");
      onUploadComplete?.(successfulFiles);
    } catch (error) {
      console.error("Upload batch error:", error);
      logger.error({
        event: "media.upload.batch_error",
        message: "One or more uploads failed",
        error,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Event handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [processFiles],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input
    e.target.value = "";
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Stats
  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;
  const errorCount = files.filter((f) => f.status === "error").length;
  const uploadingFiles = files.filter((f) => f.status === "uploading").length;

  // Aggregate progress (actual)
  useEffect(() => {
    const active = files.filter((f) =>
      ["uploading", "success"].includes(f.status),
    );
    if (!active.length) {
      setAggregateProgress(0);
      return;
    }
    const total = active.reduce((sum, f) => sum + f.progress, 0);
    const actual = Math.round(total / active.length);
    // Smooth visual interpolation using rAF
    const step = () => {
      const current = visualProgressRef.current;
      const delta = actual - current;
      if (Math.abs(delta) < 0.5) {
        visualProgressRef.current = actual;
        setAggregateProgress(actual);
        rafRef.current = null;
        return;
      }
      visualProgressRef.current = current + delta * 0.15; // easing
      setAggregateProgress(Math.round(visualProgressRef.current));
      rafRef.current = requestAnimationFrame(step);
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [files]);

  // Per-file smoothing effect: increment displayProgress toward raw progress.
  useEffect(() => {
    let cancelled = false;
    const interval = setInterval(() => {
      if (cancelled) return;
      setFiles((prev) =>
        prev.map((f) => {
          if (!["uploading", "success"].includes(f.status)) return f;
          // Initialize displayProgress if missing
          const current = f.displayProgress ?? 0;
          const target = f.progress;
          if (current >= target) return f;
          // Ease towards target; cap per tick increase to 15 percentage points
          const delta = target - current;
          const step = Math.min(15, Math.max(1, Math.round(delta * 0.2))); // 20% easing
          const next = Math.min(target, current + step);
          return { ...f, displayProgress: next };
        }),
      );
    }, 100); // 100ms cadence for perceptible but smooth animation
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {t("media.upload.title", "Upload Media Files")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {t("media.drop.or.browse", "Drop files here or click to browse")}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {t(
                "media.supported.types",
                "Supported: Images, Videos, Audio, PDF, Text files (Max {max}MB each)",
              ).replace("{max}", String(maxFileSize))}
            </p>
            <p className="text-xs text-gray-400">
              {t("media.max.files", "Maximum {max} files • Current: {current}")
                .replace("{max}", String(maxFiles))
                .replace("{current}", String(files.length))}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="border-t max-h-96 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">
                {t("media.files.heading", "Files ({count})").replace(
                  "{count}",
                  String(files.length),
                )}
                {pendingCount > 0 &&
                  ` • ${pendingCount} ${t("media.status.pending", "pending")}`}
                {successCount > 0 &&
                  ` • ${successCount} ${t("media.status.uploaded", "uploaded")}`}
                {errorCount > 0 &&
                  ` • ${errorCount} ${t("media.status.failed", "failed")}`}
                {uploadingFiles > 0 &&
                  ` • ${uploadingFiles} ${t("media.status.uploading", "uploading")}`}
              </h3>

              {/* Aggregate Progress */}
              {uploadingFiles > 0 && (
                <div className="mb-4">
                  <div className="bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${aggregateProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t(
                      "media.overall.progress",
                      "Overall Progress: {p}%",
                    ).replace("{p}", String(aggregateProgress))}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {files.map((fileData) => (
                  <div
                    key={fileData.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    {/* File Icon/Thumbnail */}
                    <div className="flex-shrink-0">
                      {fileData.thumbnail ? (
                        <img
                          src={fileData.thumbnail}
                          alt="Thumbnail"
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {getFileIcon(fileData.file.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileData.file.size)} •{" "}
                        {fileData.file.type}
                      </p>

                      {/* Progress Bar */}
                      {fileData.status === "uploading" && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${fileData.displayProgress ?? fileData.progress}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {t("media.file.progress", "{p}% uploaded").replace(
                              "{p}",
                              String(
                                fileData.displayProgress ?? fileData.progress,
                              ),
                            )}
                          </p>
                        </div>
                      )}

                      {/* Error Message */}
                      {fileData.status === "error" && fileData.errorMessage && (
                        <p className="text-xs text-red-600 mt-1">
                          {fileData.errorMessage}
                        </p>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {fileData.status === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {fileData.status === "error" && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {fileData.status === "pending" && (
                        <button
                          onClick={() => removeFile(fileData.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {files.length > 0 && (
              <>
                {t("media.total.size", "Total size: {size}").replace(
                  "{size}",
                  formatFileSize(
                    files.reduce((sum, f) => sum + f.file.size, 0),
                  ),
                )}
              </>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t("actions.cancel", "Cancel")}
            </button>

            {pendingCount > 0 && (
              <button
                onClick={uploadAllFiles}
                disabled={isUploading}
                className={`
                  px-4 py-2 bg-blue-600 text-white rounded-md transition-colors
                  ${
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }
                `}
              >
                {isUploading
                  ? t("media.uploading.status", "Uploading...")
                  : t("media.upload.n.files", "Upload {n} Files").replace(
                      "{n}",
                      String(pendingCount),
                    )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
