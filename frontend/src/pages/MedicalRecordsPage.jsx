import React, { useEffect, useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, CircularProgress, Pagination, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Chip } from '@mui/material'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import dayjs from 'dayjs'

export default function MedicalRecordsPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [viewRecord, setViewRecord] = useState(null)

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true)
      try {
        let url = ''
        if (user.roles?.includes('ROLE_PATIENT')) {
          const p = await api.get(`/patients/user/${user.id}`)
          url = `/medical-records/patient/${p.data.id}`
        } else if (user.roles?.includes('ROLE_DOCTOR')) {
          const d = await api.get(`/doctors/user/${user.id}`)
          url = `/medical-records/doctor/${d.data.id}`
        } else {
          url = '/medical-records/patient/all'
        }
        const r = await api.get(url, { params: { page: page - 1, size: 10 } })
        setRecords(r.data.content || [])
        setTotal(r.data.totalPages || 1)
      } catch {}
      setLoading(false)
    }
    fetchRecords()
  }, [page, user])

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Medical Records</Typography>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Treatment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : records.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">No records found</TableCell></TableRow>
            ) : records.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.patientName}</TableCell>
                <TableCell>{r.doctorName}</TableCell>
                <TableCell>{r.diagnosis}</TableCell>
                <TableCell>{r.treatment}</TableCell>
                <TableCell>{dayjs(r.createdAt).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => setViewRecord(r)}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={total} page={page} onChange={(_, v) => setPage(v)} />
      </Box>

      <Dialog open={Boolean(viewRecord)} onClose={() => setViewRecord(null)} maxWidth="md" fullWidth>
        <DialogTitle>Medical Record Details</DialogTitle>
        <DialogContent>
          {viewRecord && (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Patient</Typography><Typography>{viewRecord.patientName}</Typography></Grid>
              <Grid item xs={6}><Typography variant="body2" color="text.secondary">Doctor</Typography><Typography>{viewRecord.doctorName}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2" color="text.secondary">Symptoms</Typography><Typography>{viewRecord.symptoms}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2" color="text.secondary">Diagnosis</Typography><Typography>{viewRecord.diagnosis}</Typography></Grid>
              <Grid item xs={12}><Typography variant="body2" color="text.secondary">Treatment</Typography><Typography>{viewRecord.treatment}</Typography></Grid>
              {viewRecord.prescriptions?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Prescriptions</Typography>
                  {viewRecord.prescriptions.map((p, i) => (
                    <Chip key={i} label={`${p.medicineName} — ${p.dosage} × ${p.durationDays}d`} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Grid>
              )}
              <Grid item xs={12}><Typography variant="body2" color="text.secondary">Notes</Typography><Typography>{viewRecord.notes}</Typography></Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRecord(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
