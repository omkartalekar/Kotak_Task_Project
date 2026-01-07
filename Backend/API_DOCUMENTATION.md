# API Documentation - Smart Appointment Booking System

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Endpoints Overview

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "USER",
  "timezone": "America/New_York"
}
```

**Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "USER"
}
```

**Validation:**
- Password must be at least 8 characters
- Email must be valid format
- Role: USER | PROVIDER | ADMIN

---

#### 2. Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

#### 3. Get Current User
**GET** `/auth/me`

Get authenticated user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "timezone": "America/New_York",
  "createdAt": "2026-01-07T10:00:00.000Z"
}
```

---

### Provider Endpoints

#### 4. List All Providers
**GET** `/providers`

Get list of all active providers.

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "specialization": "Cardiology",
    "experienceYears": 10,
    "consultationFee": 150
  }
]
```

---

#### 5. Get Provider by ID
**GET** `/providers/:id`

Get detailed information about a specific provider.

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Dr. Jane Smith",
  "email": "jane@example.com",
  "role": "PROVIDER",
  "specialization": "Cardiology",
  "experienceYears": 10,
  "consultationFee": 150,
  "timezone": "America/New_York"
}
```

---

#### 6. Get Providers with Available Slots
**GET** `/providers/withslots`

Get providers who have available slots.

**Response (200):**
```json
[
  {
    "provider": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Dr. Jane Smith",
      "specialization": "Cardiology"
    },
    "availableSlots": 5
  }
]
```

---

### Slot Management Endpoints

#### 7. Create Slots (Provider Only)
**POST** `/slots`

Create multiple time slots.

**Headers:**
```
Authorization: Bearer <provider_token>
```

**Request Body:**
```json
{
  "startTime": "2026-01-15T09:00:00Z",
  "endTime": "2026-01-15T17:00:00Z",
  "duration": 30,
  "timezone": "America/New_York"
}
```

**Response (201):**
```json
{
  "message": "Slots created successfully",
  "count": 16
}
```

**Validation:**
- Duration: 5-180 minutes
- Times must be in future
- No overlapping slots

---

#### 8. Get Available Slots for Provider
**GET** `/slots/provider/:providerId`

Get all available slots for a specific provider.

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "time": "10:00",
    "status": "AVAILABLE"
  }
]
```

---

#### 9. Get My Slots (Provider Only)
**GET** `/slots/my`

Get provider's own slots (all statuses).

**Headers:**
```
Authorization: Bearer <provider_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "startTime": "2026-01-15T10:00:00Z",
    "endTime": "2026-01-15T10:30:00Z",
    "status": "AVAILABLE",
    "timezone": "America/New_York"
  }
]
```

---

#### 10. Block/Unblock Slot (Provider Only)
**PUT** `/slots/:id/toggle`

Toggle slot between BLOCKED and AVAILABLE status.

**Headers:**
```
Authorization: Bearer <provider_token>
```

**Request Body:**
```json
{
  "blockReason": "Personal leave"
}
```

**Response (200):**
```json
{
  "message": "Slot updated",
  "status": "BLOCKED",
  "slot": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "BLOCKED",
    "blockReason": "Personal leave",
    "blockedAt": "2026-01-07T10:00:00Z"
  }
}
```

**Edge Cases:**
- Cannot block BOOKED slots
- Only owner can toggle their slots

---

#### 11. Update Slot (Provider Only)
**PUT** `/slots/:id`

Update slot times.

**Headers:**
```
Authorization: Bearer <provider_token>
```

**Request Body:**
```json
{
  "startTime": "2026-01-15T11:00:00Z",
  "endTime": "2026-01-15T11:30:00Z"
}
```

**Response (200):**
```json
{
  "message": "Slot updated",
  "slot": { ... }
}
```

---

#### 12. Delete Slot (Provider Only)
**DELETE** `/slots/:id`

Delete an available slot.

**Headers:**
```
Authorization: Bearer <provider_token>
```

**Response (200):**
```json
{
  "message": "Slot deleted"
}
```

**Error (400):**
```json
{
  "message": "Booked slot cannot be deleted"
}
```

---

### Appointment Endpoints

#### 13. Book Appointment
**POST** `/appointments`

Book a new appointment.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "slotId": "507f1f77bcf86cd799439013",
  "timezone": "America/New_York",
  "notes": "First time consultation"
}
```

**Response (201):**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "providerId": "507f1f77bcf86cd799439012",
    "slotId": "507f1f77bcf86cd799439013",
    "status": "BOOKED",
    "timezone": "America/New_York",
    "notes": "First time consultation",
    "createdAt": "2026-01-07T10:00:00Z"
  }
}
```

**Error - Concurrent Booking (409):**
```json
{
  "message": "Slot already booked by another user or not available"
}
```

**Error - Past Slot (400):**
```json
{
  "message": "Cannot book past slots"
}
```

---

#### 14. Cancel Appointment
**DELETE** `/appointments/:id`

Cancel an appointment.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "cancellationReason": "Personal reasons"
}
```

**Response (200):**
```json
{
  "message": "Appointment cancelled successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "CANCELLED",
    "cancellationReason": "Personal reasons",
    "cancelledAt": "2026-01-07T10:00:00Z"
  }
}
```

**Error - Last Minute (400):**
```json
{
  "message": "Cannot cancel within 30 minutes of appointment time",
  "minutesRemaining": 25
}
```

**Edge Cases:**
- 30-minute cancellation window enforced
- Only appointment owner can cancel
- Slot automatically released

---

#### 15. Reschedule Appointment
**PUT** `/appointments/:id/reschedule`

Reschedule to a different slot.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "newSlotId": "507f1f77bcf86cd799439015"
}
```

**Response (200):**
```json
{
  "message": "Appointment rescheduled successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439014",
    "slotId": "507f1f77bcf86cd799439015",
    "status": "RESCHEDULED"
  },
  "newSlot": {
    "startTime": "2026-01-16T10:00:00Z",
    "endTime": "2026-01-16T10:30:00Z"
  }
}
```

**Error - Slot Unavailable (409):**
```json
{
  "message": "New slot unavailable or already booked"
}
```

**Edge Cases:**
- Old slot automatically released
- New slot atomically booked
- Rollback on failure

---

#### 16. Get Appointment History
**GET** `/appointments/history`

Get user's appointment history.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "providerId": "507f1f77bcf86cd799439012",
    "slotId": "507f1f77bcf86cd799439013",
    "status": "BOOKED",
    "createdAt": "2026-01-07T10:00:00Z"
  }
]
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "message": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden**
```json
{
  "message": "Forbidden"
}
```

**404 Not Found**
```json
{
  "message": "Resource not found"
}
```

**409 Conflict**
```json
{
  "message": "Conflict error (e.g., concurrent booking)"
}
```

**500 Internal Server Error**
```json
{
  "message": "Internal server error"
}
```

---

## Security Features

### Password Hashing
- SHA256 algorithm
- 64-character hexadecimal output

### JWT Authentication
- Token expires based on configuration
- Include in Authorization header: `Bearer <token>`

### Input Validation
- Email format validation
- Password strength (8+ chars, uppercase, lowercase, number)
- ObjectId format validation
- Timezone validation

### Authorization
- Role-based access control (USER, PROVIDER, ADMIN)
- Ownership verification for sensitive operations

---

## Edge Cases Handled

### Concurrent Booking
- Atomic database operations prevent double-booking
- Only one user can book a slot

### Last-Minute Cancellations
- 30-minute window before appointment
- Returns minutes remaining in error

### Timezone Support
- All dates stored in UTC
- Timezone metadata for proper conversion
- 400+ timezones supported

### Partial Failures
- Transaction-like rollback mechanisms
- Automatic slot release on booking failure

### Slot Blocking
- Providers can block slots with reasons
- Tracks when and why slot was blocked
- Cannot block already booked slots

---

## Postman Collection

Import the Postman collection from:
```
/postman/Smart-Appointment-Booking-API.postman_collection.json
```

Set environment variables:
- `baseUrl`: http://localhost:5000
- `token`: Your JWT token (set after login)

---

## Rate Limiting (Recommended for Production)

Consider implementing rate limiting:
- Login: 5 requests per 15 minutes
- Registration: 3 requests per hour
- General API: 100 requests per 15 minutes

---

## Support

For issues or questions, refer to the README.md or TEST_REPORT.md files.
