import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Chip, CircularProgress, Table,
  TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'

const statusColor = { SCHEDULED: 'info', CONFIRMED: 'success', COMPLETED: 'default', CANCELLED: 'error', NO_SHOW: 'warning' }

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/doctors/user/${user.id}`)
      .then(r => {
        setDoctor(r.data)
        return api.get(`/appointments/doctor/${r.data.id}?size=10`)
      })
      .then(r => setAppointments(r.data.content || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Welcome, Dr. {doctor?.name || user.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {doctor?.specialization} · {doctor?.experienceYears} years experience
      </Typography>

      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Recent Appointments</Typography>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center">No appointments</TableCell></TableRow>
                ) : appointments.map(a => (
                  <TableRow key={a.id}>
                    <TableCell>{a.patientName}</TableCell>
                    <TableCell>{dayjs(a.appointmentDate).format('MMM D, YYYY')}</TableCell>
                    <TableCell>{a.appointmentTime}</TableCell>
                    <TableCell>{a.reason}</TableCell>
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
