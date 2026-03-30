# Hospital Management System — Complete Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture](#4-architecture)
5. [Database Schema](#5-database-schema)
6. [Backend — Spring Boot](#6-backend--spring-boot)
7. [Frontend — React.js](#7-frontend--reactjs)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [API Reference](#9-api-reference)
10. [Default Seed Data](#10-default-seed-data)
11. [Local Setup Guide](#11-local-setup-guide)
12. [Docker Setup](#12-docker-setup)
13. [Environment Variables](#13-environment-variables)
14. [Role-Based Access Control](#14-role-based-access-control)
15. [Feature Walkthrough](#15-feature-walkthrough)

---

## 1. Project Overview

The Hospital Management System (HMS) is a full-stack web application designed to digitize and streamline hospital operations. It supports four user roles — Admin, Doctor, Receptionist, and Patient — each with a tailored dashboard and access controls.

### Core Capabilities
- JWT-based authentication with role-based access control
- Patient registration and profile management
- Doctor profiles with specialization and weekly schedules
- Appointment booking with real-time slot availability
- Billing and payment tracking (in ₹)
- Medical records with prescription management and file attachments
- Admin analytics dashboard with revenue and appointment stats

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Material UI v5, React Router v6 |
| Form Handling | Formik + Yup |
| HTTP Client | Axios |
| Charts | Recharts |
| Backend | Spring Boot 3.2, Java 17 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| Database | MongoDB (Spring Data MongoDB) |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build Tool | Maven 3.8+ |
| Containerization | Docker + Docker Compose |

---

## 3. Project Structure

```
hospital-management-system/
│
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/hospital/
│       ├── HospitalManagementApplication.java
│       ├── config/
│       │   ├── SecurityConfig.java          # CORS, JWT filter, auth provider
│       │   └── DataSeeder.java              # Auto-seeds default users on startup
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── PatientController.java
│       │   ├── DoctorController.java
│       │   ├── AppointmentController.java
│       │   ├── BillingController.java
│       │   ├── MedicalRecordController.java
│       │   ├── DashboardController.java
│       │   └── FileController.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── PatientService.java
│       │   ├── DoctorService.java
│       │   ├── AppointmentService.java
│       │   ├── BillingService.java
│       │   ├── MedicalRecordService.java
│       │   └── FileStorageService.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── PatientRepository.java
│       │   ├── DoctorRepository.java
│       │   ├── AppointmentRepository.java
│       │   ├── BillRepository.java
│       │   └── MedicalRecordRepository.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Patient.java
│       │   ├── Doctor.java
│       │   ├── Appointment.java
│       │   ├── Bill.java
│       │   └── MedicalRecord.java
│       ├── dto/
│       │   ├── AuthRequest.java
│       │   ├── RegisterRequest.java
│       │   └── AuthResponse.java
│       ├── security/
│       │   ├── JwtUtils.java
│       │   ├── AuthTokenFilter.java
│       │   ├── UserDetailsServiceImpl.java
│       │   ├── PatientSecurity.java
│       │   └── DoctorSecurity.java
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           ├── ResourceNotFoundException.java
│           └── BadRequestException.java
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── main.jsx                         # App entry point, MUI theme
│       ├── App.jsx                          # Routes + role-based guards
│       ├── api/
│       │   └── axios.js                     # Axios instance with JWT interceptor
│       ├── context/
│       │   └── AuthContext.jsx              # Auth state, login/logout/register
│       ├── components/
│       │   └── Layout.jsx                   # Sidebar + AppBar shell
│       └── pages/
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── AdminDashboard.jsx
│           ├── DoctorDashboard.jsx
│           ├── PatientDashboard.jsx
│           ├── PatientsPage.jsx
│           ├── DoctorsPage.jsx
│           ├── AppointmentsPage.jsx
│           ├── BookAppointmentPage.jsx
│           ├── BillingPage.jsx
│           └── MedicalRecordsPage.jsx
│
├── docker-compose.yml
└── README.md
```

---

## 4. Architecture

```
Browser (React SPA)
        │
        │  HTTP/JSON  (JWT in Authorization header)
        ▼
Spring Boot REST API  (:8080)
        │
        ├── Spring Security Filter Chain
        │       └── AuthTokenFilter  →  JwtUtils  →  UserDetailsService
        │
        ├── Controllers  (request/response mapping)
        │
        ├── Services     (business logic)
        │
        └── Repositories (Spring Data MongoDB)
                │
                ▼
           MongoDB  (:27017)
           database: hospital_db
```

### Request Flow
1. React sends request with `Authorization: Bearer <token>`
2. `AuthTokenFilter` extracts and validates the JWT
3. Sets `SecurityContext` with user authorities
4. Spring Security checks `@PreAuthorize` on the controller method
5. Controller delegates to Service → Repository → MongoDB
6. Response serialized as JSON back to React

---

## 5. Database Schema

### Collection: `users`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (bcrypt hashed)",
  "phone": "string",
  "roles": ["ROLE_ADMIN | ROLE_DOCTOR | ROLE_RECEPTIONIST | ROLE_PATIENT"],
  "active": true,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Collection: `patients`
```json
{
  "_id": "ObjectId",
  "userId": "string (ref: users)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "ISODate",
  "gender": "MALE | FEMALE | OTHER",
  "bloodGroup": "A+ | B+ | O+ ...",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "emergencyContact": {
    "name": "string",
    "relationship": "string",
    "phone": "string"
  },
  "allergies": ["string"],
  "chronicConditions": ["string"],
  "insuranceNumber": "string",
  "active": true
}
```

### Collection: `doctors`
```json
{
  "_id": "ObjectId",
  "userId": "string (ref: users)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "specialization": "string",
  "qualification": "string",
  "experienceYears": 10,
  "licenseNumber": "string",
  "consultationFee": 800.0,
  "schedules": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "17:00",
      "slotDurationMinutes": 30
    }
  ],
  "available": true,
  "active": true
}
```

### Collection: `appointments`
```json
{
  "_id": "ObjectId",
  "patientId": "string",
  "patientName": "string",
  "doctorId": "string",
  "doctorName": "string",
  "specialization": "string",
  "appointmentDate": "ISODate",
  "appointmentTime": "HH:mm",
  "reason": "string",
  "notes": "string",
  "status": "SCHEDULED | CONFIRMED | COMPLETED | CANCELLED | NO_SHOW",
  "cancelReason": "string"
}
```

### Collection: `bills`
```json
{
  "_id": "ObjectId",
  "patientId": "string",
  "patientName": "string",
  "appointmentId": "string",
  "doctorId": "string",
  "doctorName": "string",
  "items": [
    {
      "description": "Consultation",
      "quantity": 1,
      "unitPrice": 800.0,
      "total": 800.0
    }
  ],
  "subtotal": 800.0,
  "tax": 80.0,
  "discount": 0.0,
  "totalAmount": 880.0,
  "paidAmount": 0.0,
  "paymentStatus": "PENDING | PARTIAL | PAID | CANCELLED | REFUNDED",
  "paymentMethod": "CASH | CARD | INSURANCE | ONLINE",
  "paymentDate": "ISODate"
}
```

### Collection: `medical_records`
```json
{
  "_id": "ObjectId",
  "patientId": "string",
  "patientName": "string",
  "doctorId": "string",
  "doctorName": "string",
  "appointmentId": "string",
  "diagnosis": "string",
  "symptoms": "string",
  "treatment": "string",
  "prescriptions": [
    {
      "medicineName": "string",
      "dosage": "string",
      "frequency": "string",
      "durationDays": 7,
      "instructions": "string"
    }
  ],
  "attachments": ["filename.pdf"],
  "notes": "string"
}
```

---

## 6. Backend — Spring Boot

### Security Layer

**`JwtUtils`** — generates and validates JWT tokens
- `generateJwtToken(Authentication)` — used on login
- `generateTokenFromEmail(String)` — used on register
- `validateJwtToken(String)` — validates signature + expiry
- `getEmailFromJwtToken(String)` — extracts subject

**`AuthTokenFilter`** — `OncePerRequestFilter` that reads `Authorization` header, validates token, and sets `SecurityContext`

**`UserDetailsServiceImpl`** — loads user by email from MongoDB, maps roles to `GrantedAuthority`

**`SecurityConfig`** — configures:
- Stateless session (JWT, no cookies)
- Public routes: `/api/auth/**`, `/swagger-ui/**`, `/api-docs/**`
- CORS: allows `localhost:3000` and `localhost:5173`

### Service Layer

| Service | Responsibility |
|---|---|
| `AuthService` | Login (authenticate + generate JWT), Register (save user + generate JWT) |
| `PatientService` | CRUD patients, search by name/email/phone, soft delete |
| `DoctorService` | CRUD doctors, filter by specialization, availability |
| `AppointmentService` | Book appointments, slot availability check, cancel, status updates |
| `BillingService` | Create bills, calculate totals (subtotal + 10% tax − discount), record payments |
| `MedicalRecordService` | Create/update records, attach files, query by patient or doctor |
| `FileStorageService` | Store uploaded files to local disk (`./uploads`), serve by filename |

### Exception Handling

`GlobalExceptionHandler` (`@RestControllerAdvice`) handles:
- `ResourceNotFoundException` → 404
- `BadRequestException` → 400
- `AccessDeniedException` → 403
- `MethodArgumentNotValidException` → 400 with field-level errors
- `Exception` (catch-all) → 500

### Data Seeder

`DataSeeder` (`CommandLineRunner`) runs on every startup and seeds default users if they don't already exist. Idempotent — safe to restart.

---

## 7. Frontend — React.js

### Routing (`App.jsx`)

| Path | Component | Access |
|---|---|---|
| `/login` | `LoginPage` | Public |
| `/register` | `RegisterPage` | Public |
| `/admin` | `AdminDashboard` | ROLE_ADMIN |
| `/doctor` | `DoctorDashboard` | ROLE_DOCTOR |
| `/patient` | `PatientDashboard` | ROLE_PATIENT |
| `/patients` | `PatientsPage` | ADMIN, RECEPTIONIST, DOCTOR |
| `/doctors` | `DoctorsPage` | All authenticated |
| `/appointments` | `AppointmentsPage` | All authenticated |
| `/appointments/book` | `BookAppointmentPage` | All authenticated |
| `/billing` | `BillingPage` | ADMIN, RECEPTIONIST |
| `/medical-records` | `MedicalRecordsPage` | All authenticated |

After login, users are automatically redirected to their role-specific dashboard.

### Auth Context (`AuthContext.jsx`)

Provides `user`, `login()`, `register()`, `logout()`, `hasRole()` to the entire app via React Context. Persists token and user object in `localStorage`.

### Axios Instance (`api/axios.js`)

- Base URL: `/api` (proxied to `localhost:8080` in dev)
- Request interceptor: attaches `Authorization: Bearer <token>`
- Response interceptor: redirects to `/login` on 401

### Key Pages

**`AdminDashboard`** — fetches `/api/dashboard/admin`, shows stat cards (patients, doctors, appointments, revenue) and a bar chart via Recharts.

**`DoctorDashboard`** — fetches doctor profile by userId, then loads recent appointments.

**`PatientDashboard`** — fetches patient profile by userId, shows appointment history with a "Book Appointment" shortcut.

**`BookAppointmentPage`** — two-step: select doctor + date → fetch available slots → pick slot → submit. Slots are fetched live from `/api/appointments/slots`.

**`PatientsPage`** — paginated table with search, inline add/edit dialog using Formik.

**`BillingPage`** — lists bills, shows payment status chips, "Record Payment" dialog with amount + method.

---

## 8. Authentication & Authorization

### Login Flow
```
POST /api/auth/login
  { email, password }
    → AuthenticationManager.authenticate()
    → JWT generated
    → Returns { token, id, name, email, roles }

Frontend stores token in localStorage
All subsequent requests: Authorization: Bearer <token>
```

### Register Flow
```
POST /api/auth/register
  { name, email, password, phone, roles }
    → Check email uniqueness
    → BCrypt encode password
    → Save User to MongoDB
    → Generate JWT
    → Returns { token, id, name, email, roles }
```

### Token Details
- Algorithm: HS256
- Expiry: 24 hours (86400000 ms)
- Secret: configurable via `JWT_SECRET` env var

---

## 9. API Reference

### Authentication

| Method | Endpoint | Body | Auth | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | `{email, password}` | No | Login |
| POST | `/api/auth/register` | `{name, email, password, phone, roles}` | No | Register |

### Patients

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/patients` | ADMIN, RECEPTIONIST | Create patient |
| GET | `/api/patients?search=&page=&size=` | ADMIN, DOCTOR, RECEPTIONIST | List patients |
| GET | `/api/patients/{id}` | Authenticated | Get by ID |
| GET | `/api/patients/user/{userId}` | Authenticated | Get by user ID |
| PUT | `/api/patients/{id}` | ADMIN, RECEPTIONIST, owner | Update |
| DELETE | `/api/patients/{id}` | ADMIN | Soft delete |

### Doctors

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/doctors` | ADMIN | Create doctor |
| GET | `/api/doctors?search=&page=&size=` | Authenticated | List doctors |
| GET | `/api/doctors/available` | Authenticated | Available doctors |
| GET | `/api/doctors/specialization/{spec}` | Authenticated | By specialization |
| GET | `/api/doctors/{id}` | Authenticated | Get by ID |
| GET | `/api/doctors/user/{userId}` | Authenticated | Get by user ID |
| PUT | `/api/doctors/{id}` | ADMIN, owner | Update |
| DELETE | `/api/doctors/{id}` | ADMIN | Soft delete |

### Appointments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/appointments` | Authenticated | Book appointment |
| GET | `/api/appointments/{id}` | Authenticated | Get by ID |
| GET | `/api/appointments/patient/{id}?page=&size=` | Authenticated | By patient |
| GET | `/api/appointments/doctor/{id}?page=&size=` | Authenticated | By doctor |
| GET | `/api/appointments/slots?doctorId=&date=` | Authenticated | Available slots |
| PUT | `/api/appointments/{id}` | Authenticated | Update |
| PATCH | `/api/appointments/{id}/cancel` | Authenticated | Cancel with reason |

### Billing

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/bills` | ADMIN, RECEPTIONIST | Create bill |
| GET | `/api/bills/{id}` | Authenticated | Get by ID |
| GET | `/api/bills/patient/{id}?page=&size=` | Authenticated | By patient |
| PUT | `/api/bills/{id}` | ADMIN, RECEPTIONIST | Update bill |
| PATCH | `/api/bills/{id}/payment` | ADMIN, RECEPTIONIST | Record payment |

### Medical Records

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/medical-records` | ADMIN, DOCTOR | Create record |
| GET | `/api/medical-records/{id}` | Authenticated | Get by ID |
| GET | `/api/medical-records/patient/{id}?page=&size=` | Authenticated | By patient |
| GET | `/api/medical-records/doctor/{id}?page=&size=` | ADMIN, DOCTOR | By doctor |
| PUT | `/api/medical-records/{id}` | ADMIN, DOCTOR | Update |
| POST | `/api/medical-records/{id}/attachments` | ADMIN, DOCTOR | Upload file |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard/admin` | ADMIN | Stats: patients, doctors, appointments, revenue |

### Files

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/files/upload` | Authenticated | Upload file |
| GET | `/api/files/{fileName}` | Authenticated | Download file |

---

## 10. Default Seed Data

On first startup, the following accounts are created automatically:

### Staff Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@hospital.com | admin123 |
| Receptionist | reception@hospital.com | recep123 |

### Doctor Accounts (all use password: `doctor123`)

| Name | Email | Specialization | Fee |
|---|---|---|---|
| Dr. Arjun Sharma | arjun@hospital.com | Cardiology | ₹800 |
| Dr. Priya Mehta | priya@hospital.com | Neurology | ₹1000 |
| Dr. Rahul Verma | rahul@hospital.com | Orthopedics | ₹700 |
| Dr. Sneha Patel | sneha@hospital.com | Pediatrics | ₹600 |
| Dr. Kavita Nair | kavita@hospital.com | Dermatology | ₹650 |
| Dr. Suresh Iyer | suresh@hospital.com | Gastroenterology | ₹900 |
| Dr. Ananya Bose | ananya@hospital.com | Gynecology | ₹750 |
| Dr. Manoj Tiwari | manoj@hospital.com | Psychiatry | ₹850 |
| Dr. Ritu Gupta | ritu@hospital.com | Ophthalmology | ₹700 |
| Dr. Deepak Joshi | deepak@hospital.com | ENT | ₹600 |
| Dr. Pooja Reddy | pooja@hospital.com | Endocrinology | ₹950 |
| Dr. Nikhil Desai | nikhil@hospital.com | Pulmonology | ₹800 |
| Dr. Shweta Kulkarni | shweta@hospital.com | Nephrology | ₹1100 |
| Dr. Aakash Malhotra | aakash@hospital.com | Oncology | ₹1200 |
| Dr. Meera Pillai | meera@hospital.com | Rheumatology | ₹850 |

### Patient Accounts (all use password: `patient123`)

| Name | Email |
|---|---|
| Amit Kumar | amit@example.com |
| Sunita Rao | sunita@example.com |
| Vikram Singh | vikram@example.com |

---

## 11. Local Setup Guide

### Prerequisites

| Tool | Version |
|---|---|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MongoDB | 6+ (running on port 27017) |

### Step 1 — Start MongoDB

```bash
# Windows service
net start MongoDB

# Or run directly
mongod --dbpath C:\data\db
```

### Step 2 — Start Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui.html`

Seed data is printed to console on first run:
```
INFO  DataSeeder - Seeded admin -> admin@hospital.com / admin123
INFO  DataSeeder - Seeded doctor -> arjun@hospital.com / doctor123
...
```

### Step 3 — Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: `http://localhost:3000`

The Vite dev server proxies all `/api` requests to `localhost:8080` — no CORS issues.

---

## 12. Docker Setup

Run the entire stack (MongoDB + Backend + Frontend) with one command:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MongoDB | localhost:27017 |

To stop:
```bash
docker-compose down
```

To wipe data:
```bash
docker-compose down -v
```

---

## 13. Environment Variables

### Backend (`application.yml` / env override)

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/hospital_db` | MongoDB connection string |
| `JWT_SECRET` | (64-char hex in yml) | JWT HMAC-SHA256 signing key |
| `JWT_EXPIRATION` | `86400000` | Token expiry in ms (24h) |
| `FILE_UPLOAD_DIR` | `./uploads` | Directory for uploaded files |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP host (optional) |
| `MAIL_USERNAME` | — | SMTP username (optional) |
| `MAIL_PASSWORD` | — | SMTP password (optional) |

### Frontend

No `.env` needed for local dev. The Vite proxy handles API routing.

For production builds, set:
```
VITE_API_BASE_URL=https://your-api-domain.com
```

---

## 14. Role-Based Access Control

| Feature | Admin | Doctor | Receptionist | Patient |
|---|---|---|---|---|
| Admin Dashboard | ✅ | ❌ | ❌ | ❌ |
| Doctor Dashboard | ❌ | ✅ | ❌ | ❌ |
| Patient Dashboard | ❌ | ❌ | ❌ | ✅ |
| View All Patients | ✅ | ✅ | ✅ | ❌ |
| Add/Edit Patient | ✅ | ❌ | ✅ | Own only |
| View All Doctors | ✅ | ✅ | ✅ | ✅ |
| Add/Edit Doctor | ✅ | Own only | ❌ | ❌ |
| Book Appointment | ✅ | ✅ | ✅ | ✅ |
| View Appointments | All own | Own | All | Own |
| Cancel Appointment | ✅ | ✅ | ✅ | ✅ |
| Create Bill | ✅ | ❌ | ✅ | ❌ |
| Record Payment | ✅ | ❌ | ✅ | ❌ |
| Create Medical Record | ✅ | ✅ | ❌ | ❌ |
| View Medical Records | ✅ | Own patients | ❌ | Own |
| Upload Files | ✅ | ✅ | ❌ | ❌ |

---

## 15. Feature Walkthrough

### Booking an Appointment (Patient)
1. Log in as a patient (`amit@example.com / patient123`)
2. Click "Book Appointment" from dashboard or sidebar
3. Select a doctor from the dropdown (shows name, specialization, fee)
4. Pick a date — only future dates allowed
5. Available time slots load automatically based on doctor's schedule
6. Select a slot, enter reason, click "Book Appointment"
7. Appointment appears in "My Appointments" with status `SCHEDULED`

### Managing Appointments (Doctor)
1. Log in as a doctor (`arjun@hospital.com / doctor123`)
2. Doctor Dashboard shows today's upcoming appointments
3. Navigate to Appointments page for full history
4. Can cancel appointments with a reason

### Billing Workflow (Receptionist)
1. Log in as receptionist (`reception@hospital.com / recep123`)
2. Navigate to Billing
3. Bills are created via `POST /api/bills` (typically after appointment completion)
4. Click "Record Payment" to log a payment — supports partial payments
5. Status auto-updates: PENDING → PARTIAL → PAID

### Medical Records (Doctor)
1. Log in as a doctor
2. Navigate to Medical Records
3. Create a record with diagnosis, symptoms, treatment, prescriptions
4. Upload reports/prescriptions via the attachment endpoint
5. Patients can view their own records from the Medical Records page

### Admin Analytics
1. Log in as admin (`admin@hospital.com / admin123`)
2. Dashboard shows: total patients, total doctors, total appointments, total revenue
3. Bar chart shows scheduled vs completed vs total appointments
4. Navigate to Patients/Doctors for full management with search and pagination
