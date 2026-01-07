# Backend API

REST API for appointment booking.

## Setup

```bash
npm install
npm start
```

Server: http://localhost:5000

## Environment

Create `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/appointment-booking
JWT_SECRET=your_secret_here
```

## Tech

- Node.js + Express
- MongoDB
- JWT auth
- SHA256 password hashing

## Routes

### Auth
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Users (admin)
```
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

### Providers
```
GET /api/providers
GET /api/providers/withslots
PUT /api/providers/:id
```

### Slots
```
GET    /api/slots/provider/:providerId
GET    /api/slots/my
POST   /api/slots
PUT    /api/slots/:id
DELETE /api/slots/:id
```

### Appointments
```
GET    /api/appointments/history
POST   /api/appointments
PUT    /api/appointments/:id/reschedule
DELETE /api/appointments/:id
```

## Models

User: name, email, password, role (USER/PROVIDER/ADMIN)
Slot: providerId, startTime, endTime, status
Appointment: userId, providerId, slotId, status

## How It Works

1. User picks provider and slot
2. POST /api/appointments with slotId
3. Server checks availability
4. If free -> mark slot as BOOKED
5. If taken -> return error

Uses atomic MongoDB operations to prevent double booking.

## Structure

```
src/
  controllers/
  models/
  routes/
  middleware/
  utils/
  config/
```



