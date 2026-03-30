import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, TextField, Table, TableBody, TableCell,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, CircularProgress, Pagination } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import api from '../api/axios'

const schema = Yup.object({
  name: Yup.string().required('Required'),
  email: Yup.string().email().required('Required'),
  phone: Yup.string().required('Required'),
  gender: Yup.string().required('Required'),
  bloodGroup: Yup.string(),
})

export default function PatientsPage() {
  const [patients, setPatients] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const fetchPatients = () => {
    setLoading(true)
    api.get('/patients', { params: { search, page: page - 1, size: 10 } })
      .then(r => { setPatients(r.data.content); setTotal(r.data.totalPages) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPatients() }, [page, search])

  const formik = useFormik({
    initialValues: { name: '', email: '', phone: '', gender: '', bloodGroup: '', userId: '' },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (editing) {
        await api.put(`/patients/${editing.id}`, values)
      } else {
        await api.post('/patients', values)
      }
      setOpen(false)
      fetchPatients()
    },
  })

  const openEdit = (patient) => {
    setEditing(patient)
    formik.setValues({ name: patient.name, email: patient.email, phone: patient.phone || '',
      gender: patient.gender || '', bloodGroup: patient.bloodGroup || '', userId: patient.userId || '' })
    setOpen(true)
  }

  const openAdd = () => {
    setEditing(null)
    formik.resetForm()
    setOpen(true)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>Patients</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Patient</Button>
      </Box>

      <TextField placeholder="Search patients..." size="small" sx={{ mb: 2, width: 300 }}
        value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : patients.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.gender}</TableCell>
                <TableCell>{p.bloodGroup}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={total} page={page} onChange={(_, v) => setPage(v)} />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              {['name', 'email', 'phone', 'gender', 'bloodGroup'].map(field => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField fullWidth label={field.charAt(0).toUpperCase() + field.slice(1)} name={field}
                    value={formik.values[field]} onChange={formik.handleChange}
                    error={formik.touched[field] && Boolean(formik.errors[field])}
                    helperText={formik.touched[field] && formik.errors[field]} />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
