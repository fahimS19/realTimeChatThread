# realTimeChat & ThreadHub

### Real-Time Thread & Chat Application

![Project Banner](path-to-your-banner-or-screenshot.png)

**realTimeChat & ThreadHub** is a modern, full-stack real-time forum and messaging platform built with **Next.js, Express, PostgreSQL, Socket.IO, and Clerk**.  
It supports real-time threads, notifications, direct messaging, and image uploads, all wrapped in a responsive and scalable architecture.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup & Migrations](#database-setup--migrations)
- [Running the Application](#running-the-application)
- [Realtime Capabilities](#realtime-capabilities)

---

## Overview

**realTimeChat & ThreadHub** combines a discussion forum with real-time chat functionality.  
Users can create threads, reply, like content, exchange private messages, and receive instant notifications — all powered by WebSockets.

The application is designed as a **monorepo** with separate frontend and backend services.

---

## Features

- Authentication and user management with **Clerk**
- Real-time thread replies and like notifications
- Direct user-to-user messaging
- Image uploads via **Cloudinary**
- Unread notification count tracking
- Fully responsive UI (mobile-first)
- Real-time updates using **Socket.IO**
- RESTful backend with **Express + PostgreSQL**
- Frontend state management using React Context API

---

## Tech Stack

### Frontend

- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS
- Clerk Authentication
- Socket.IO Client
- Sonner (toast notifications)
- Lucide-react (icons)

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Socket.IO
- Multer (file handling)
- Cloudinary (image storage)

### Tooling

- Docker & Docker Compose
- Axios
- pg (PostgreSQL client)
- tsx (TypeScript execution)

---

## Getting Started

### Prerequisites

- Ensure you have the following installed:
- Node.js (v18+ recommended)
- npm or yarn
- Docker (for PostgreSQL)

## Installation

1. Clone the Repository

```bash
git clone https://github.com/fahimS19/realTimeChatThread.git
cd realTimeChatThread
```

2. Install Dependencies
   Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd ../frontend
npm install
```

## Environment Variables

- Backend environment variables

Create a .env file inside the **backend** directory:

```text
# Server
PORT=5000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=real_time_chat_app
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Clerk Authentication
CLERK_FRONTEND_API=your-clerk-frontend-api
CLERK_API_KEY=your-clerk-api-key
CLERK_JWT_KEY=your-clerk-jwt-key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret


Note: Replace all placeholder values with your actual credentials.
```

Create a `.env.local` file inside the **frontend** directory and add the following variables:

- Frontend environment variables

```text
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key


Note: Replace all placeholder values with your actual credentials.
```

## Database Setup & Migrations

1. Start PostgreSQL Using Docker from the project root:

```bash
docker compose up -d
```

This will:

-Start a PostgreSQL container
-Expose the database on localhost:5432

2. Run Database Migrations

```bash
cd backend
npm run migrate
```

This command creates all required database tables.

If you encounter issues, verify your database credentials in .env folder

## Running the Application

_Start the Backend Server_

```bash
cd backend
npm run dev
```

Backend will be available at: http://localhost:5000

Socket.IO is initialized on the same server for real-time communication.

_Start the Frontend Server_

```bash
cd ../frontend
npm run dev
```

Frontend will be available at: http://localhost:3000
The frontend automatically connects to the backend API and WebSocket server.

## Realtime Capabilities

- Live thread updates (replies, likes)
- Instant notification delivery
- Real-time unread notification counts
- Private messaging with WebSocket-based delivery

_Relevant backend logic can be found in:_

- backend/realTime/io.ts
- backend/modules/notifications/
