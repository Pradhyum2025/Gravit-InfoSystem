# Smart Event Booking System - Frontend

A modern, fully functional frontend for an event booking system built with React, Redux Toolkit, and Shadcn UI components.

## Features

- 🎫 User registration and authentication
- 📅 Browse and search events
- 🎟️ Real-time seat booking with Socket.IO
- 📱 QR code generation for tickets
- 👤 User dashboard with bookings and profile
- 🔧 Admin dashboard for event management
- 🎨 Modern UI with Zomato-red theme
- ✨ Smooth animations with Framer Motion

## Tech Stack

- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Framer Motion** for animations
- **Socket.IO Client** for real-time updates
- **QRCode.react** for ticket QR codes

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # Shadcn UI components
│   │   ├── ProtectedRoute.jsx
│   │   └── BookingModal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── EventDetail.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Events.jsx
│   │   ├── Bookings.jsx
│   │   ├── Profile.jsx
│   │   └── admin/
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   ├── lib/
│   │   ├── api.js
│   │   └── utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Routes

- `/` - Landing page with all events
- `/login` - User login
- `/register` - User registration
- `/events/:id` - Event detail page
- `/dashboard` - User dashboard
- `/bookings` - User bookings with QR codes
- `/profile` - User profile
- `/admin/dashboard` - Admin dashboard
- `/admin/events` - Manage events
- `/admin/events/create` - Create/edit event
- `/admin/bookings` - All bookings management

## Color Theme

- **Primary**: Zomato Red (#FF3C00)
- **Background**: White (#FFFFFF)
- **Text**: Black/Gray

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.


