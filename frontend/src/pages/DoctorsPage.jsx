import React, { useEffect, useState } from 'react'
import { Box, Typography, TextField, Table, TableBody, TableCell, TableHead,
  TableRow, Paper, Chip, CircularProgress, Pagination, Card, CardContent,
  Grid, Avatar } from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import api from '../api/axios'

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/doctors', { params: { search, page: page - 1, size: 12 } })
      .then(r => { setDoctors(r.data.content); setTotal(r.data.totalPages) })
      .finally(() => setLoading(false))
  }, [page, search])

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Doctors</Typography>
      <TextField placeholder="Search by name or specialization..." size="small" sx={{ mb: 3, width: 350 }}
        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={2}>
          {doctors.map(d => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{d.name?.[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={600}>{d.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{d.specialization}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">Qualification: {d.qualification}</Typography>
                  <Typography variant="body2">Experience: {d.experienceYears} years</Typography>
                  <Typography variant="body2">Fee: ₹{d.consultationFee}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={d.available ? 'Available' : 'Unavailable'}
                      color={d.available ? 'success' : 'default'} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={total} page={page} onChange={(_, v) => setPage(v)} />
      </Box>
    </Box>
  )
}
