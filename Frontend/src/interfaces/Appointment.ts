export interface Appointment {
  _id: string;
  userId: string;
  providerId: string;
  slotId: string;
  status: 'BOOKED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED' | 'NO_SHOW';
  timezone?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // populated fields
  providerName?: string;
  userName?: string;
  slotTime?: string;
}

export interface CreateAppointmentDTO {
  slotId: string;
}

export interface RescheduleAppointmentDTO {
  newSlotId: string;
}
