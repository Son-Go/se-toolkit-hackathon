import api from './api';
import { Resource, Comment } from '../types';

interface ResourcesResponse {
  resources: Resource[];
}

interface ResourceResponse {
  resource: Resource;
  comments: Comment[];
}

export const resourceService = {
  async getByCourse(courseId: string, params?: {
    search?: string;
    fileType?: string;
    tag?: string;
    sortBy?: string;
    order?: string;
  }): Promise<Resource[]> {
    const response = await api.get<ResourcesResponse>(`/resources/course/${courseId}`, { params });
    return response.data.resources;
  },

  async getById(id: string): Promise<{ resource: Resource; comments: Comment[] }> {
    const response = await api.get<ResourceResponse>(`/resources/${id}`);
    return response.data;
  },

  async upload(data: FormData): Promise<Resource> {
    const response = await api.post<ResourceResponse>('/resources', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.resource;
  },

  async update(resourceId: string, data: { title?: string; description?: string; tags?: string[] }): Promise<Resource> {
    const response = await api.put<ResourceResponse>(`/resources/${resourceId}`, data);
    return response.data.resource;
  },

  async delete(resourceId: string): Promise<void> {
    await api.delete(`/resources/${resourceId}`);
  },

  async download(resourceId: string) {
    window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/resources/${resourceId}/download`, '_blank');
  },

  async addComment(resourceId: string, content: string): Promise<Comment> {
    const response = await api.post<{ comment: Comment }>(`/resources/${resourceId}/comments`, { content });
    return response.data.comment;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/resources/comments/${commentId}`);
  }
};
