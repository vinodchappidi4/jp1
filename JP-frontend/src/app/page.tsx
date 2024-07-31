'use client';
import { useState } from 'react';
import Image from 'next/image';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton, Container, Box, ListItemIcon } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import Student from './pages/student';
import Department from './pages/department';
import Company from './pages/company';
import {Avatar } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { School as SchoolIcon, Business as BusinessIcon, Work as WorkIcon } from '@mui/icons-material';

const drawerWidth = 150;
const footerHeight = 25;
const topBarHeight = 40;

export default function Home() {
  const [currentView, setCurrentView] = useState<'students' | 'department' | 'Company' | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isActive = (view: string) => currentView === view;
  const [drawerState, setDrawerState] = useState<'open' | 'mini' | 'closed'>('open');

  const toggleDrawer = () => {
    setDrawerState(prev => prev === 'open' ? 'mini' : 'open');
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#13505b', height: `${topBarHeight}px`, }}>
      <Toolbar sx={{ minHeight: `${topBarHeight}px !important`, height: topBarHeight, display: 'flex', alignItems: 'center', justifyContent: 'space-between',  padding: '0 16px' }}>
  {/* Left section */}
  <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
    <IconButton
      color="inherit"
      aria-label="toggle drawer"
      onClick={toggleDrawer}
      edge="start"
      sx={{ mr: 2 }}
    >
      {isDrawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
    </IconButton>
    <Box sx={{ position: 'relative', width: 90, height: 50 }}>
      <Image
        src="/jp-logo.png"
        alt="JP Logo"
        layout="fill"
        objectFit="contain"
      />
    </Box>
  </Box>
  
  {/* Center section */}
  <Box sx={{ display: 'flex', justifyContent: 'center', width: '33%' }}>
    <Typography variant="h5" sx={{ color: '#ffff' }}>
      JP Website
    </Typography>
  </Box>
  
  {/* Right section */}
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '33%' }}>
  <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
  <Avatar sx={{ bgcolor: 'white', color:'#13505b', width: 30, height: 30 }}>
    <PersonIcon />
  </Avatar>
</IconButton>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      onClick={handleClose}
    >
      <MenuItem onClick={handleClose}>My Profile</MenuItem>
      <MenuItem onClick={handleClose}>Logout</MenuItem>
    </Menu>
  </Box>
</Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerState === 'open' ? drawerWidth : 40,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerState === 'open' ? drawerWidth : 40,
      boxSizing: 'border-box',
      transition: 'width 0.2s',
      overflowX: 'hidden',
      backgroundColor: '#0c7489',
      color: '#ffff',
      marginTop: `${topBarHeight}px`,
          },
        }}
      >
        
        <Box >
        <List sx={{ padding: 0 }}>
  {['students', 'department', 'Company'].map((view) => (
    <ListItem 
      key={view}
      button 
      onClick={() => setCurrentView(view as 'students' | 'department' | 'Company')}
      sx={{ 
        padding: '8px 4px',
        '& .MuiListItemIcon-root': { minWidth: 40 },
        backgroundColor: isActive(view) ? '#489fb5' : 'transparent',
        '&:hover': {
          backgroundColor: isActive(view) ? '#489fb5' : '#0e6377',
        },
      }}
    >
      <ListItemIcon sx={{ 
            marginRight: drawerState === 'open' ? 1 : 'auto',  
            color: isActive(view) ? '#ffffff' : '#e0e0e0'
          }}>
        {view === 'students' && <SchoolIcon />}
        {view === 'department' && <BusinessIcon />}
        {view === 'Company' && <WorkIcon />}
      </ListItemIcon>
      <ListItemText 
        primary={view.charAt(0).toUpperCase() + view.slice(1)} 
        sx={{ color: isActive(view) ? '#ffffff' : '#e0e0e0' }}
      />
    </ListItem>
  ))}
</List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        ml: drawerState === 'closed' ? 0 : (drawerState === 'mini' ? '40px' : `${drawerWidth}px`), 
        transition: 'margin-left 0.2s', 
        pb: `${footerHeight}px`, 
        mt: `${topBarHeight}px`,
        pt: 2,
        }}>
        <Container>
          {currentView === 'students' && <Student />}
          {currentView === 'department' && <Department />}
          {currentView === 'Company' && <Company />}
        </Container>
      </Box>

      <Box component="footer" sx={{ 
         height: `${footerHeight}px`,
         backgroundColor: '#13505b', 
         color: 'white', 
         textAlign: 'center',
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         position: 'fixed', 
         bottom: 0, 
         left: drawerState === 'closed' ? 0 : (drawerState === 'mini' ? '40px' : `${drawerWidth}px`), 
         right: 0, 
         transition: 'left 0.2s'
      }}>
        <Typography variant="body1">© 2024 JP Website</Typography>
      </Box>
    </Box>
  );
}