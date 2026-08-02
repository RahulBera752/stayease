# StayEase 🏨 — Luxury Hotel Booking Platform (MERN Stack)

A full-stack, portfolio-quality hotel booking web application built with MongoDB, Express, React, and Node.js.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router DOM, Redux Toolkit, Axios, React Hook Form, Framer Motion, React Icons, React Hot Toast, Lucide React

**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT Auth, bcryptjs, Cookie Parser, dotenv, CORS, Multer, Cloudinary

## Project Structure

```
stayease/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level pages
│       ├── layouts/      # Shared page layouts (Navbar/Footer wrappers)
│       ├── hooks/        # Custom React hooks
│       ├── context/      # React Context providers (Auth, etc.)
│       ├── redux/        # Redux Toolkit store & slices
│       ├── services/     # Axios API service layer
│       ├── utils/        # Helper functions
│       └── assets/       # Images, static files
└── server/          # Express + MongoDB backend
    ├── controllers/      # Route handler logic
    ├── routes/           # Express route definitions
    ├── middleware/        # Auth, error handling, upload middleware
    ├── models/           # Mongoose schemas
    ├── config/           # DB & Cloudinary configuration
    └── utils/            # Helper functions (token generation, etc.)
```

## Getting Started

### Backend

```bash
cd server
npm install
cp .env.example .env   # fill in your MongoDB Atlas URI, JWT secret, Cloudinary keys
npm run dev
```

Server runs at `http://localhost:5000`.

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Client runs at `http://localhost:5173`.

## Build Status

This project is being generated incrementally:

- [x] Step 1: Folder structure, npm packages, base backend & frontend setup
- [ ] Step 2: Database models (User, Hotel, Room, Booking, Review, Wishlist)
- [ ] Step 3: Auth system (register/login/JWT/OTP/forgot password)
- [ ] Step 4: Hotel & room controllers/routes
- [ ] Step 5: Booking flow & payment UI
- [ ] Step 6: Frontend pages (Landing, Auth, Hotel listing/details)
- [ ] Step 7: User dashboard (profile, wishlist, bookings)
- [ ] Step 8: Admin dashboard (manage hotels/bookings/users, analytics)
- [ ] Step 9: Polish — animations, dark mode, responsiveness, empty states, 404
