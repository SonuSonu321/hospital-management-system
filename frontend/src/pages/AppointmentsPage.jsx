import React, { useEffect, useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, CircularProgress, Pagination, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'

const statusColor = { SCHEDULED: 'info', CONFIRMED: 'success', COMPLETED: 'default', CANCELLED: 'error', NO_SHOW: 'warning' }

export default function AppointmentsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cancelDialog, setCancelDialog] = useState({ open: false, id: null })
  const [cancelReason, setCancelReason] = useState('')

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_RECEPTIONIST')

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      let url = '/appointments'
      if (user.roles?.includes('ROLE_PATIENT')) {
        const p = await api.get(`/patients/user/${user.id}`)
        url = `/appointments/patient/${p.data.id}`
      } else if (user.roles?.includes('ROLE_DOCTOR')) {
        const d = await api.get(`/doctors/user/${user.id}`)
        url = `/appointments/doctor/${d.data.id}`
      }
      const r = await api.get(url, { params: { page: page - 1, size: 10 } })
      setAppointments(r.data.content || [])
      setTotal(r.data.totalPages || 1)
    } catch (e) {}
    setLoading(false)
  }

  useEffect(() => { fetchAppointments() }, [page])

  const handleCancel = async () => {
    await api.patch(`/appointments/${cancelDialog.id}/cancel`, { reason: cancelReason })
    setCancelDialog({ open: false, id: null })
    setCancelReason('')
    fetchAppointments()
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Appointments</Typography>
        <Button variant="contained" onClick={() => navigate('/appointments/book')}>Book Appointment</Button>
      </Box>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : appointments.map(a => (
              <TableRow key={a.id}>
                <TableCell>{a.patientName}</TableCell>
                <TableCell>{a.doctorName}</TableCell>
                <TableCell>{dayjs(a.appointmentDate).format('MMM D, YYYY')}</TableCell>
                <TableCell>{a.appointmentTime}</TableCell>
                <TableCell>{a.reason}</TableCell>
                <TableCell><Chip label={a.status} color={statusColor[a.status]} size="small" /></TableCell>
                <TableCell>
                  {a.status !== 'CANCELLED' && a.status !== 'COMPLETED' && (
                    <Button size="small" color="error"
                      onClick={() => setCancelDialog({ open: true, id: a.id })}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={total} page={page} onChange={(_, v) => setPage(v)} />
      </Box>

      <Dialog open={cancelDialog.open} onClose={() => setCancelDialog({ open: false, id: null })}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Reason for cancellation" multiline rows={3} sx={{ mt: 1 }}
            value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, id: null })}>Back</Button>
          <Button color="error" variant="contained" onClick={handleCancel}>Confirm Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
