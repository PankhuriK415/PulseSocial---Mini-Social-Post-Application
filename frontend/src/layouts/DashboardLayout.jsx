import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl } from '../utils/avatar';
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper,
  Divider,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  HomeRounded as HomeIcon,
  PersonRounded as ProfileIcon,
  LogoutRounded as LogoutIcon,
  BlurOnRounded as LogoIcon,
  BarChartRounded as StatsIcon,
  TrendingUpRounded as TrendingIcon,
  AddCircleOutlineRounded as AddIcon,
} from '@mui/icons-material';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [logoutOpen, setLogoutOpen] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/feed' },
    { text: 'Profile', icon: <ProfileIcon />, path: `/profile/${user?._id}` },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };

  // Render Sidebar for larger screens
  const renderSidebar = () => (
    <Box sx={{ position: 'sticky', top: 24 }}>
      {/* Brand Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pl: 2 }}>
        <LogoIcon sx={{ fontSize: 36, color: '#6366F1', mr: 1 }} />
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 800,
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PulseSocial
        </Typography>
      </Box>

      {/* Navigation Links */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: '#111827',
          mb: 3,
        }}
      >
        <List sx={{ p: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 3,
                    color: isActive ? '#6366F1' : '#94A3B8',
                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      color: '#F8FAFC',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#6366F1' : '#94A3B8',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* User Session card in sidebar */}
      {user && (
        <Paper
          sx={{
            p: 2,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#111827',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <Avatar
              src={getAvatarUrl(user.avatar || user.username)}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                {user.username}
              </Typography>
              <Typography variant="caption" noWrap sx={{ display: 'block', color: '#94A3B8' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleLogoutClick} sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}>
            <LogoutIcon size="small" />
          </IconButton>
        </Paper>
      )}
    </Box>
  );

  // Render Right Panel (Community Stats & Activity)
  const renderRightPanel = () => (
    <Box sx={{ position: 'sticky', top: 24 }}>
      {/* Community Stats */}
      <Paper sx={{ p: 3, borderRadius: 4, mb: 3, backgroundColor: '#111827' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StatsIcon sx={{ color: '#06B6D4', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>
            Pulse Stats
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>Active Members</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#06B6D4' }}>1,248</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>Daily Pulses (Posts)</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#6366F1' }}>342</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>Avg. Interactions</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10B981' }}>94.2%</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Trending Topics */}
      <Paper sx={{ p: 3, borderRadius: 4, backgroundColor: '#111827' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingIcon sx={{ color: '#8B5CF6', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>
            Trending Now
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ cursor: 'pointer', '&:hover h6': { color: '#6366F1' } }}>
            <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 600 }}>#tech</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F8FAFC', transition: 'color 0.2s' }}>
              Building SaaS with React & MUI
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>142 Pulses</Typography>
          </Box>
          <Divider sx={{ opacity: 0.5 }} />
          <Box sx={{ cursor: 'pointer', '&:hover h6': { color: '#6366F1' } }}>
            <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600 }}>#design</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F8FAFC', transition: 'color 0.2s' }}>
              Minimalist Glassmorphism in 2026
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>98 Pulses</Typography>
          </Box>
          <Divider sx={{ opacity: 0.5 }} />
          <Box sx={{ cursor: 'pointer', '&:hover h6': { color: '#6366F1' } }}>
            <Typography variant="caption" sx={{ color: '#06B6D4', fontWeight: 600 }}>#startup</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#F8FAFC', transition: 'color 0.2s' }}>
              How to structure MERN stack folders
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>74 Pulses</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0F172A' }}>
      
      {/* Mobile Top Navbar */}
      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            borderRadius: 0,
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            py: 1.5,
            px: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LogoIcon sx={{ fontSize: 28, color: '#6366F1', mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Pulse
            </Typography>
          </Box>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => navigate(`/profile/${user?._id}`)} sx={{ p: 0.5 }}>
                <Avatar
                  src={getAvatarUrl(user.avatar || user.username)}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
              <IconButton onClick={handleLogoutClick} sx={{ color: '#94A3B8' }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Paper>
      )}

      {/* Main Grid Content */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 3, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Grid container spacing={3}>
          {/* Left Column (Sidebar) */}
          {!isMobile && (
            <Grid item md={3}>
              {renderSidebar()}
            </Grid>
          )}

          {/* Center Column (Feed / Profile) */}
          <Grid item xs={12} md={6}>
            <Outlet />
          </Grid>

          {/* Right Column (Community Stats) */}
          {!isMobile && (
            <Grid item md={3}>
              {renderRightPanel()}
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            borderRadius: 0,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#111827',
          }}
        >
          <BottomNavigation
            value={location.pathname}
            onChange={(event, newValue) => handleNavigation(newValue)}
            sx={{ backgroundColor: 'transparent', height: 60 }}
          >
            <BottomNavigationAction
              label="Home"
              value="/feed"
              icon={<HomeIcon />}
              sx={{
                color: '#94A3B8',
                '&.Mui-selected': { color: '#6366F1' },
              }}
            />
            <BottomNavigationAction
              label="Profile"
              value={`/profile/${user?._id}`}
              icon={<ProfileIcon />}
              sx={{
                color: '#94A3B8',
                '&.Mui-selected': { color: '#6366F1' },
              }}
            />
          </BottomNavigation>
        </Paper>
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, color: '#F8FAFC' }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            Are you sure you want to log out of PulseSocial?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button
            onClick={() => setLogoutOpen(false)}
            variant="text"
            sx={{ color: '#94A3B8' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 3,
              boxShadow: 'none',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardLayout;
