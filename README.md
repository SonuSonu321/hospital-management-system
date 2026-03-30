# Hospital Management System

Full-stack HMS built with React.js, Spring Boot, and MongoDB.

## Roles
- **Admin** — full access, dashboard analytics
- **Doctor** — manage appointments, write medical records
- **Receptionist** — manage patients, billing
- **Patient** — book appointments, view records

## Tech Stack
- Frontend: React 18, Vite, MUI, Formik/Yup, Axios, Recharts
- Backend: Spring Boot 3.2, Spring Security (JWT), Spring Data MongoDB
- Database: MongoDB
- Docs: Swagger UI at `/swagger-ui.html`

## Quick Start (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

## Local Development

### Backend
```bash
cd backend
# Requires Java 17 + MongoDB running locally
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:3000
```

## Environment Variables (Backend)

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/hospital_db` | MongoDB connection |
| `JWT_SECRET` | (see application.yml) | JWT signing key |
| `MAIL_USERNAME` | — | SMTP email (optional) |
| `MAIL_PASSWORD` | — | SMTP password (optional) |

## API Endpoints

| Resource | Endpoint |
|---|---|
| Auth | `POST /api/auth/login`, `POST /api/auth/register` |
| Patients | `GET/POST /api/patients`, `GET/PUT /api/patients/{id}` |
| Doctors | `GET/POST /api/doctors`, `GET /api/doctors/available` |
| Appointments | `GET/POST /api/appointments`, `GET /api/appointments/slots` |
| Billing | `GET/POST /api/bills`, `PATCH /api/bills/{id}/payment` |
| Medical Records | `GET/POST /api/medical-records` |
| Dashboard | `GET /api/dashboard/admin` |
| Files | `POST /api/files/upload`, `GET /api/files/{fileName}` |
