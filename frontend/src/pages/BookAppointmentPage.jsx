import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Grid, TextField, MenuItem,
  Button, Alert, CircularProgress, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const schema = Yup.object({
  doctorId: Yup.string().required('Select a doctor'),
  appointmentDate: Yup.string().required('Select a date'),
  appointmentTime: Yup.string().required('Select a time slot'),
  reason: Yup.string().required('Provide a reason'),
})

export default function BookAppointmentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [slots, setSlots] = useState([])
  const [patient, setPatient] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/doctors/available').then(r => setDoctors(r.data))
    api.get(`/patients/user/${user.id}`).then(r => setPatient(r.data)).catch(() => {})
  }, [user.id])

  const formik = useFormik({
    initialValues: { doctorId: '', appointmentDate: '', appointmentTime: '', reason: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setError('')
        const doctor = doctors.find(d => d.id === values.doctorId)
        await api.post('/appointments', {
          ...values,
          patientId: patient?.id,
          patientName: user.name,
          doctorName: doctor?.name,
          specialization: doctor?.specialization,
        })
        setSuccess(true)
        setTimeout(() => navigate('/appointments'), 1500)
      } catch (err) {
        setError(err.response?.data?.message || 'Booking failed')
      }
    },
  })

  const fetchSlots = async (doctorId, date) => {
    if (!doctorId || !date) return
    try {
      const r = await api.get('/appointments/slots', { params: { doctorId, date } })
      setSlots(r.data)
    } catch { setSlots([]) }
  }

  const handleDoctorChange = (e) => {
    formik.handleChange(e)
    formik.setFieldValue('appointmentTime', '')
    fetchSlots(e.target.value, formik.values.appointmentDate)
  }

  const handleDateChange = (e) => {
    formik.handleChange(e)
    formik.setFieldValue('appointmentTime', '')
    fetchSlots(formik.values.doctorId, e.target.value)
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Book Appointment</Typography>

      {success && <Alert severity="success" sx={{ mb: 2 }}>Appointment booked successfully! Redirecting...</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card elevation={2}>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Select Doctor" name="doctorId"
                  value={formik.values.doctorId} onChange={handleDoctorChange}
                  error={formik.touched.doctorId && Boolean(formik.errors.doctorId)}
                  helperText={formik.touched.doctorId && formik.errors.doctorId}>
                  {doctors.map(d => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name} — {d.specialization} (₹{d.consultationFee})
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Appointment Date" name="appointmentDate" type="date"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  value={formik.values.appointmentDate} onChange={handleDateChange}
                  error={formik.touched.appointmentDate && Boolean(formik.errors.appointmentDate)}
                  helperText={formik.touched.appointmentDate && formik.errors.appointmentDate} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Available Time Slots</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {slots.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {formik.values.doctorId && formik.values.appointmentDate ? 'No slots available' : 'Select doctor and date'}
                    </Typography>
                  ) : slots.map(slot => (
                    <Chip key={slot} label={slot}
                      color={formik.values.appointmentTime === slot ? 'primary' : 'default'}
                      onClick={() => formik.setFieldValue('appointmentTime', slot)}
                      clickable />
                  ))}
                </Box>
                {formik.touched.appointmentTime && formik.errors.appointmentTime && (
                  <Typography variant="caption" color="error">{formik.errors.appointmentTime}</Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Reason for Visit" name="reason" multiline rows={3}
                  value={formik.values.reason} onChange={formik.handleChange}
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason} />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? <CircularProgress size={24} /> : 'Book Appointment'}
                </Button>
                <Button sx={{ ml: 2 }} onClick={() => navigate(-1)}>Cancel</Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
