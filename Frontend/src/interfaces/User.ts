export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'USER' | 'PROVIDER' | 'ADMIN';
  avatar?: string;
  age?: number;
  isActive: boolean;
  isDeleted: boolean;
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
  permissions?: string[];
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'PROVIDER' | 'ADMIN';
  age?: number;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: 'USER' | 'PROVIDER' | 'ADMIN';
  age?: number;
  isActive?: boolean;
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
}
