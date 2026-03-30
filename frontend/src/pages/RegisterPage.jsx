import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress, MenuItem } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Required'),
  phone: Yup.string(),
})

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = React.useState('')

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', phone: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setError('')
        await register({ ...values, roles: ['ROLE_PATIENT'] })
        navigate('/')
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed')
      }
    },
  })

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 440 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Create Account</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Register as a patient</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={formik.handleSubmit}>
          <TextField fullWidth label="Full Name" name="name" sx={{ mb: 2 }}
            value={formik.values.name} onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name} />
          <TextField fullWidth label="Email" name="email" type="email" sx={{ mb: 2 }}
            value={formik.values.email} onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email} />
          <TextField fullWidth label="Phone" name="phone" sx={{ mb: 2 }}
            value={formik.values.phone} onChange={formik.handleChange} />
          <TextField fullWidth label="Password" name="password" type="password" sx={{ mb: 3 }}
            value={formik.values.password} onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password} />
          <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
