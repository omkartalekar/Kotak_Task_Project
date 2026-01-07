export interface Provider {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProviderDTO {
  specialization?: string;
  experienceYears?: number;
  consultationFee?: number;
  isActive?: boolean;
}
