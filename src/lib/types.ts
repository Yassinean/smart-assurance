
export interface ApiConnection {
  id: string;
  name: string;
  url: string;
  status: ConnectionStatus;
  lastConnected?: string;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'error';

export interface AssuranceApplication {
  id: string;
  policyNumber: string;
  customerName: string;
  type: ApplicationType;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  premium?: number;
  coverageAmount?: number;
  startDate?: string;
  endDate?: string;
  documents?: Document[];
}

export type ApplicationType = 'health' | 'life' | 'auto' | 'property' | 'travel';

export type ApplicationStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'under_review' 
  | 'cancelled'
  | 'active'
  | 'expired';

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Authentication types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
