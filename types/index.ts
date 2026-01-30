// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Contact Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

// Service types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  features?: string[];
}

// Navigation types
export interface NavLink {
  href: string;
  label: string;
  submenu?: NavLink[];
}
