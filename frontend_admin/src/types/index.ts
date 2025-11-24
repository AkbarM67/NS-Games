export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
}

export interface Settings {
  logo?: string;
  site_name?: string;
  maintenance_mode?: boolean;
}