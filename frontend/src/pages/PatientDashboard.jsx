import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Chip, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'

const statusColor = { SCHEDULED: 'info', CONFIRMED: 'success', COMPLETED: 'default', CANCELLED: 'error', NO_SHOW: 'warning' }

export default function PatientDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/patients/user/${user.id}`)
      .then(r => {
        setPatient(r.data)
        return api.get(`/appointments/patient/${r.data.id}?size=10`)
      })
      .then(r => setAppointments(r.data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Welcome, {user.name}</Typography>
          <Typography variant="body2" color="text.secondary">Manage your appointments and health records</Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/appointments/book')}>Book Appointment</Button>
      </Box>

      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>My Appointments</Typography>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center">No appointments yet</TableCell></TableRow>
                ) : appointments.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.doctorName}</TableCell>
                    <TableCell>{a.specialization}</TableCell>
                    <TableCell>{dayjs(a.appointmentDate).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{a.appointmentTime}</TableCell>
                    <TableCell><Chip label={a.status} color={statusColor[a.status]} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  )
}
