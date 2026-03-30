import React, { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import EventIcon from '@mui/icons-material/Event'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/axios'

function StatCard({ title, value, icon, color }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={700}>{value ?? '—'}</Typography>
          </Box>
          <Box sx={{ bgcolor: color, borderRadius: 2, p: 1.5, color: 'white' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

  const chartData = [
    { name: 'Scheduled', value: stats?.scheduledAppointments || 0 },
    { name: 'Completed', value: stats?.completedAppointments || 0 },
    { name: 'Total', value: stats?.totalAppointments || 0 },
  ]

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Admin Dashboard</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Patients" value={stats?.totalPatients} icon={<PeopleIcon />} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Doctors" value={stats?.totalDoctors} icon={<LocalHospitalIcon />} color="#388e3c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Appointments" value={stats?.totalAppointments} icon={<EventIcon />} color="#f57c00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Revenue (₹)" value={stats?.totalRevenue?.toFixed(2)} icon={<AttachMoneyIcon />} color="#7b1fa2" />
        </Grid>
      </Grid>

      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Appointment Overview</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  )
}
