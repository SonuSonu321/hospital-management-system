import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress } from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import { useAuth } from '../context/AuthContext'

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = React.useState('')

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        setError('')
        await login(values.email, values.password)
        navigate('/')
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed')
      }
    },
  })

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LocalHospitalIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" fontWeight={700}>Hospital Management</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={formik.handleSubmit}>
          <TextField fullWidth label="Email" name="email" type="email" sx={{ mb: 2 }}
            value={formik.values.email} onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email} />
          <TextField fullWidth label="Password" name="password" type="password" sx={{ mb: 3 }}
            value={formik.values.password} onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password} />
          <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
