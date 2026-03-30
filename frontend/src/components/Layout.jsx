import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Avatar, Menu,
  MenuItem, Divider, Tooltip
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import EventIcon from '@mui/icons-material/Event'
import ReceiptIcon from '@mui/icons-material/Receipt'
import FolderIcon from '@mui/icons-material/Folder'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../context/AuthContext'

const DRAWER_WIDTH = 240

function getNavItems(roles = []) {
  const items = []
  if (roles.includes('ROLE_ADMIN')) items.push({ label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' })
  if (roles.includes('ROLE_DOCTOR')) items.push({ label: 'Dashboard', icon: <DashboardIcon />, path: '/doctor' })
  if (roles.includes('ROLE_PATIENT')) items.push({ label: 'Dashboard', icon: <DashboardIcon />, path: '/patient' })
  if (!roles.includes('ROLE_PATIENT')) items.push({ label: 'Patients', icon: <PeopleIcon />, path: '/patients' })
  items.push({ label: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' })
  items.push({ label: 'Appointments', icon: <EventIcon />, path: '/appointments' })
  if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_RECEPTIONIST'))
    items.push({ label: 'Billing', icon: <ReceiptIcon />, path: '/billing' })
  items.push({ label: 'Medical Records', icon: <FolderIcon />, path: '/medical-records' })
  return items
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const navItems = getNavItems(user?.roles || [])

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main' }}>
        <LocalHospitalIcon sx={{ color: 'white', mr: 1 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>HMS</Typography>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Hospital Management System
          </Typography>
          <Tooltip title={user?.name}>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>{user?.name?.[0]}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled><Typography variant="body2">{user?.email}</Typography></MenuItem>
            <Divider />
            <MenuItem onClick={() => { logout(); navigate('/login') }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
          open>
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
