# 🏥 Smart Telemedicine Web Platform

A modern, full-stack telemedicine application enabling secure video consultations, appointment booking, and medical record management between Patients and Doctors.

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20PostgreSQL-blue)

## 🌟 Features

-   **Role-Based Access**: Distinct portals for **Patients**, **Doctors**, and **Admins**.
-   **Real-Time Video**: Secure peer-to-peer video consultations using WebRTC & Socket.io.
-   **Appointments**: Interactive booking system with email notifications.
-   **EHR Management**: Electronic Health Records storage using MongoDB.
-   **Secure Auth**: JWT-based authentication with password hashing.

---

## 🚀 Getting Started

Follow this step-by-step guide to run the project on your local machine.

### Prerequisites
Ensure you have the following installed:
-   **Node.js** (v18+)
-   **Docker Desktop** (Required for databases)
-   **Git**

### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd telemedicine-platform
```

### 2️⃣ Start Databases (Docker)
The easiest way to run the required databases (PostgreSQL & MongoDB) is using Docker.

1.  Make sure Docker Desktop is running.
2.  Run the following command in the root directory:
    ```bash
    docker compose up -d postgres mongo
    ```
3.  Verify they are running:
    ```bash
    docker ps
    ```
    You should see `telemedicine_postgres` and `telemedicine_mongo`.

### 3️⃣ Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5000
    DATABASE_URL="postgresql://postgres:MATRIX@localhost:5432/telemedicine?schema=public"
    MONGO_URI="mongodb://localhost:27017/telemedicine"
    JWT_SECRET="supersecretkey123"
    ```
4.  **Database Setup**:
    Sync the schema and seed initial data (including the **Admin** account):
    ```bash
    npx prisma db push
    npx prisma db seed
    ```
    *Note: If seed fails, ensure databases are running and try again.*

5.  **Start the Server**:
    ```bash
    npm start
    ```
    ✅ Server should be running on `http://localhost:5000`.

### 4️⃣ Frontend Setup
1.  Open a **new terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Configuration**:
    Create a `.env.local` file in the `frontend` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```
4.  **Start the Client**:
    ```bash
    npm run dev
    ```
    ✅ Client should be running on `http://localhost:3000`.

---

## 🔑 Login Credentials

### Admin
-   **Email**: `admin@telehealth.com`
-   **Password**: `admin123`

### Patient / Doctor
-   You can register a new account via the **Sign Up** page.
-   To become a Doctor, select the "Doctor" role during signup.

---

## 🛠️ Usage Guide

### 1. Booking Appointments
-   Login as a **Patient**.
-   Navigate to **Appointments** > **Book Appointment**.
-   Select a doctor, date, and time.

### 2. Video Consultation
-   Once an appointment is confirmed, join the video room via the Dashboard.
-   Both Patient and Doctor must be in the room `http://localhost:3000/dashboard/room/[meeting-id]`.

---

## ☁️ Deployment

### Frontend (Vercel)
Import the `frontend` folder into Vercel and deploy. Set `NEXT_PUBLIC_API_URL` to your live backend URL.

### Backend (Render/Heroku)
Deploy the `backend` folder. Ensure you set `DATABASE_URL` (to a cloud Postgres like Neon) and `MONGO_URI` (to MongoDB Atlas).
