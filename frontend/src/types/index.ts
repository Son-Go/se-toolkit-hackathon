export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  created_by: string;
  creator_name: string;
  member_count: number;
  role?: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_path: string;
  file_type: string;
  file_size: number;
  course_id: string;
  uploaded_by: string;
  uploader_name: string;
  tags: string[];
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  resource_id: string;
  user_id: string;
  username: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
