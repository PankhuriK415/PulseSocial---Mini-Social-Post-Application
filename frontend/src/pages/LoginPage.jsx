import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  BlurOnRounded as LogoIcon,
  VisibilityOffRounded as VisibilityOffIcon,
  VisibilityRounded as VisibilityIcon,
} from '@mui/icons-material';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const validateForm = () => {
    if (!email || !password) {
      setToast({ open: true, message: 'Please fill in all fields', severity: 'error' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({ open: true, message: 'Please enter a valid email address', severity: 'error' });
      return false;
    }
    if (password.length < 6) {
      setToast({ open: true, message: 'Password must be at least 6 characters', severity: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      setToast({ open: true, message: 'Logged in successfully!', severity: 'success' });
      
      // Save credentials in AuthContext
      login(response);
      
      // Navigate to Home Feed
      setTimeout(() => {
        navigate('/feed');
      }, 1000);
    } catch (err) {
      setToast({ open: true, message: err.message || 'Login failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0F172A',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Blob */}
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(0,0,0,0) 70%)',
          top: '20%',
          left: '20%',
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ zIndex: 1, width: '100%', maxWidth: '420px' }}
      >
        <Card
          className="glass-card"
          sx={{
            borderRadius: 5,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 5 } }}>
            {/* Header / Logo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <LogoIcon sx={{ fontSize: 36, color: '#6366F1', mr: 0.5 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  PulseSocial
                </Typography>
              </Link>
              <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', mt: 1 }}>
                Welcome back! Please enter your details.
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#94A3B8' } }}
                  inputProps={{ style: { color: '#F8FAFC' } }}
                />

                <TextField
                  label="Password"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  InputLabelProps={{ style: { color: '#94A3B8' } }}
                  inputProps={{ style: { color: '#F8FAFC' } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#94A3B8' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    mt: 1,
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#F8FAFC' }} /> : 'Sign In'}
                </Button>
              </Box>
            </form>

            {/* Footer Links */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Snackbar Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%', borderRadius: 3 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginPage;
