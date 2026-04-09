import api from './api';
import { Course } from '../types';

interface CoursesResponse {
  courses: Course[];
}

interface CourseResponse {
  course: Course;
}

export const courseService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get<CoursesResponse>('/courses');
    return response.data.courses;
  },

  async getMyCourses(): Promise<Course[]> {
    const response = await api.get<CoursesResponse>('/courses/my');
    return response.data.courses;
  },

  async getById(id: string): Promise<Course> {
    const response = await api.get<CourseResponse>(`/courses/${id}`);
    return response.data.course;
  },

  async create(name: string, code: string, description: string): Promise<Course> {
    const response = await api.post<CourseResponse>('/courses', {
      name,
      code,
      description
    });
    return response.data.course;
  },

  async join(courseId: string): Promise<Course> {
    const response = await api.post<CourseResponse>(`/courses/${courseId}/join`);
    return response.data.course;
  },

  async delete(courseId: string): Promise<void> {
    await api.delete(`/courses/${courseId}`);
  }
};
