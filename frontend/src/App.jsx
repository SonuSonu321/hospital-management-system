import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientDashboard from './pages/PatientDashboard'
import PatientsPage from './pages/PatientsPage'
import DoctorsPage from './pages/DoctorsPage'
import AppointmentsPage from './pages/AppointmentsPage'
import BillingPage from './pages/BillingPage'
import MedicalRecordsPage from './pages/MedicalRecordsPage'
import BookAppointmentPage from './pages/BookAppointmentPage'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.some(r => user.roles?.includes(r))) return <Navigate to="/" replace />
  return children
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.roles?.includes('ROLE_ADMIN')) return <Navigate to="/admin" replace />
  if (user.roles?.includes('ROLE_DOCTOR')) return <Navigate to="/doctor" replace />
  return <Navigate to="/patient" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<DashboardRedirect />} />
          <Route path="admin" element={<PrivateRoute roles={['ROLE_ADMIN']}><AdminDashboard /></PrivateRoute>} />
          <Route path="doctor" element={<PrivateRoute roles={['ROLE_DOCTOR']}><DoctorDashboard /></PrivateRoute>} />
          <Route path="patient" element={<PrivateRoute roles={['ROLE_PATIENT']}><PatientDashboard /></PrivateRoute>} />
          <Route path="patients" element={<PrivateRoute roles={['ROLE_ADMIN','ROLE_RECEPTIONIST','ROLE_DOCTOR']}><PatientsPage /></PrivateRoute>} />
          <Route path="doctors" element={<PrivateRoute><DoctorsPage /></PrivateRoute>} />
          <Route path="appointments" element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} />
          <Route path="appointments/book" element={<PrivateRoute><BookAppointmentPage /></PrivateRoute>} />
          <Route path="billing" element={<PrivateRoute roles={['ROLE_ADMIN','ROLE_RECEPTIONIST']}><BillingPage /></PrivateRoute>} />
          <Route path="medical-records" element={<PrivateRoute><MedicalRecordsPage /></PrivateRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
