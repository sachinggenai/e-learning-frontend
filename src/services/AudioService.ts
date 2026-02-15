/**
 * AudioService — Audio asset management API client.
 *
 * Endpoints:
 *   POST   /assets/audio                      — upload audio
 *   GET    /assets/audio/{audioId}             — get audio asset
 *   PATCH  /assets/audio/{audioId}             — update audio metadata
 *   DELETE /assets/audio/{audioId}             — delete audio
 *   GET    /courses/{courseId}/narration        — get course narration map
 */

import { httpClient } from './httpClient';
import { AudioAssetResponse } from '../types/course';

class AudioService {
  async uploadAudio(file: File, courseId?: string): Promise<AudioAssetResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (courseId) formData.append('courseId', courseId);

    const { data } = await httpClient.post('/assets/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120_000, // 2 min for large files
    });
    return data;
  }

  async getAudio(audioId: string): Promise<AudioAssetResponse> {
    const { data } = await httpClient.get(`/assets/audio/${audioId}`);
    return data;
  }

  async updateAudioMetadata(audioId: string, updates: {
    label?: string;
    transcript?: string;
  }): Promise<AudioAssetResponse> {
    const { data } = await httpClient.patch(`/assets/audio/${audioId}`, updates);
    return data;
  }

  async deleteAudio(audioId: string): Promise<void> {
    await httpClient.delete(`/assets/audio/${audioId}`);
  }

  async getCourseNarration(courseId: string): Promise<any> {
    const { data } = await httpClient.get(`/courses/${courseId}/narration`);
    return data;
  }
}

export const audioService = new AudioService();
