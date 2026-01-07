# Appointment Booking System

Full-stack appointment booking application for service providers and users.

## Project Structure

```
├── Backend/     - Node.js REST API
└── Frontend/    - React TypeScript UI
```

## Features

- User authentication with JWT
- Role-based access (User, Provider, Admin)
- Real-time appointment booking
- Slot management for providers
- Cancel and reschedule appointments
- Admin dashboard for user/provider management

## Getting Started

### Backend Setup

```bash
cd Backend
npm install
```

Create `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/appointment-booking
JWT_SECRET=your_secret
```

Start server:
```bash
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm start
```

App runs on http://localhost:3000

## Tech Stack

**Backend**
- Node.js + Express
- MongoDB
- JWT authentication
- SHA256 password hashing

**Frontend**
- React 19 + TypeScript
- React Router
- Axios
- CSS Modules

## User Roles

- **USER**: Book and manage appointments
- **PROVIDER**: Create slots, view bookings
- **ADMIN**: Full system access

## API Endpoints

Backend runs on http://localhost:5000/api

See `Backend/API_DOCUMENTATION.md` for details.

## Development

Both frontend and backend run independently. Backend must be running for frontend to work.

Default credentials can be created via register endpoint or admin can create users.

MongoDB must be running locally or provide remote connection string.
