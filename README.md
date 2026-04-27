<h1 align="center">PrepDost</h1>

<p align="center">
  AI-powered interview preparation platform built with MERN + Gemini.
</p>

<p align="center">
  <img alt="Node" src="https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=111111" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" />
</p>

## What Is PrepDost?

PrepDost helps users prepare for interviews by generating structured AI interview reports from:

- Resume (PDF upload)
- Self declaration
- Job description

It includes secure authentication, password recovery with email verification code, private dashboards, and interview report history.

## Core Features

| Feature | Description |
| --- | --- |
| Authentication | Register, login, logout, protected routes, and JWT-based session flow |
| Password Recovery | Forgot password, verify reset code, and reset password |
| AI Interview Analysis | Upload resume + context and generate AI-powered interview report |
| Report History | Fetch all reports and open detailed report by interview ID |
| Full Stack Architecture | React frontend, Express backend, MongoDB persistence |

## Tech Stack

### Frontend

- React 19
- React Router
- Axios
- Sass
- Vite

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT + bcryptjs
- Multer + pdf-parse
- Google Gemini SDK
- Nodemailer

## Project Structure

```text
Gen-Ai Project/
|- Backend/
|  |- server.js
|  |- src/
|     |- app.js
|     |- config/
|     |- controllers/
|     |- middlewares/
|     |- models/
|     |- routes/
|     |- services/
|- Frontend/
|  |- src/
|     |- features/
|     |- pages/
|     |- App.jsx
|- README.md
```

## Local Setup

### 1. Prerequisites

- Node.js 18+ (recommended latest LTS)
- npm
- MongoDB URI (Atlas/local)
- Google Gemini API key

### 2. Clone Repository

```bash
git clone https://github.com/me-sayanghosh/PrepDost.git
cd PrepDost
```

### 3. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```bash
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

# Gemini
GOOGLE_API_KEY=your_google_api_key
# or
GEMINI_API_KEY=your_gemini_api_key

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Optional SMTP for forgot-password emails
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
MAIL_FROM=PrepDost <verified-sender@your-domain.com>
```

Run backend:

```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

Open app at `http://localhost:5173`.

## API Overview

### Auth Routes (`/api/auth`)

- `POST /register`
- `POST /login`
- `GET /logout`
- `GET /get-me` (private)
- `POST /forgot-password`
- `POST /verify-reset-code`
- `POST /reset-password`

### Interview Routes (`/api/interview`)

- `POST /generate-report` (private, multipart/form-data)
- `POST /` (private, backward compatible endpoint)
- `GET /` (private, report list)
- `GET /report/:interviewId` (private, single report)

## Deployment

- Frontend: `https://prep-dost.vercel.app`
- Backend: `https://prepdost.onrender.com`

## Available Scripts

### Backend

- `npm run dev` - Start backend with nodemon

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint frontend code

## Notes

- If SMTP is not configured correctly, forgot-password email sending will fail.
- `CORS_ORIGINS` can be extended as comma-separated values in backend env.
- Frontend uses `Authorization: Bearer <token>` for private API routes.

## License

This project is currently unlicensed.
