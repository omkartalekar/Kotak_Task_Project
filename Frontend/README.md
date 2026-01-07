# Frontend

React app for appointment booking system.

## Setup

```bash
npm install
npm start
```

Runs on http://localhost:3000

## What's Inside

- React 19 + TypeScript
- React Router
- Axios for API
- CSS Modules
- JWT auth

## Folder Structure

```
src/
  api/          -> API calls
  auth/         -> Login/Register
  components/   -> Sidebar, Topbar
  pages/        -> Users, Providers, Appointments, etc
  interfaces/   -> TypeScript types
  utils/        -> auth helpers
```

## Pages

- `/login` - Login page
- `/` - Dashboard
- `/users` - Manage users (admin)
- `/providers` - Manage providers (admin)
- `/appointments` - Book/view appointments
- `/provider-slots` - Manage slots (provider)
- `/profile` - User profile

## Roles

- USER: book appointments
- PROVIDER: create slots, see bookings
- ADMIN: full access

## API Config

Edit `src/api/axios.ts` to change backend URL:
```typescript
baseURL: "http://localhost:5000/api"
```

## Build

```bash
npm run build
```

That's it.



