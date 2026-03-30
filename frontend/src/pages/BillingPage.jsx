import React, { useEffect, useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip, CircularProgress, Pagination, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid } from '@mui/material'
import api from '../api/axios'
import dayjs from 'dayjs'

const statusColor = { PENDING: 'warning', PARTIAL: 'info', PAID: 'success', CANCELLED: 'error', REFUNDED: 'default' }

export default function BillingPage() {
  const [bills, setBills] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [payDialog, setPayDialog] = useState({ open: false, bill: null })
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('CASH')

  const fetchBills = () => {
    setLoading(true)
    // Admin view — fetch all bills via patient search workaround
    api.get('/bills/patient/all', { params: { page: page - 1, size: 10 } })
      .catch(() => api.get('/bills', { params: { page: page - 1, size: 10 } }))
      .then(r => { setBills(r.data.content || []); setTotal(r.data.totalPages || 1) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBills() }, [page])

  const handlePayment = async () => {
    await api.patch(`/bills/${payDialog.bill.id}/payment`, { amount: parseFloat(payAmount), method: payMethod })
    setPayDialog({ open: false, bill: null })
    fetchBills()
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Billing</Typography>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : bills.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">No bills found</TableCell></TableRow>
            ) : bills.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.patientName}</TableCell>
                <TableCell>{b.doctorName}</TableCell>
                <TableCell>₹{b.totalAmount?.toFixed(2)}</TableCell>
                <TableCell>₹{b.paidAmount?.toFixed(2)}</TableCell>
                <TableCell><Chip label={b.paymentStatus} color={statusColor[b.paymentStatus]} size="small" /></TableCell>
                <TableCell>{dayjs(b.createdAt).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  {b.paymentStatus !== 'PAID' && b.paymentStatus !== 'CANCELLED' && (
                    <Button size="small" variant="outlined"
                      onClick={() => { setPayDialog({ open: true, bill: b }); setPayAmount('') }}>
                      Record Payment
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

      <Dialog open={payDialog.open} onClose={() => setPayDialog({ open: false, bill: null })}>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Outstanding: ₹{((payDialog.bill?.totalAmount || 0) - (payDialog.bill?.paidAmount || 0)).toFixed(2)}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Amount" type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField select fullWidth label="Payment Method" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
                {['CASH', 'CARD', 'INSURANCE', 'ONLINE'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayDialog({ open: false, bill: null })}>Cancel</Button>
          <Button variant="contained" onClick={handlePayment} disabled={!payAmount}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
