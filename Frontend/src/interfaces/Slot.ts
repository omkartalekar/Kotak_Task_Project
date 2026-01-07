export interface Slot {
  _id: string;
  providerId: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
  appointmentId?: string;
  timezone?: string;
  blockReason?: string;
  blockedAt?: string;
  createdAt: string;
  updatedAt: string;
  time?: string; // formatted time string
}

export interface CreateSlotDTO {
  providerId: string;
  date: string;
  time: string;
  duration?: number;
}

export interface UpdateSlotDTO {
  time?: string;
  status?: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
  blockReason?: string;
}
