import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
} from '@mui/material';
import {
  BlurOnRounded as LogoIcon,
  ForumRounded as ChatIcon,
  FavoriteRounded as HeartIcon,
  ImageRounded as ImageIcon,
  SpeedRounded as FastIcon,
  LockRounded as SecureIcon,
  KeyboardArrowDownRounded as ArrowDownIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  const handleScrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        height: '100vh',
        width: '100vw',
        overflowY: 'scroll',
        overflowX: 'hidden',
        scrollSnapType: 'y mandatory', // Smooth vertical Scroll Snapping
        scrollBehavior: 'smooth',
        position: 'relative',
        '&::-webkit-scrollbar': {
          display: 'none', // Hide scrollbars
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      {/* Background Glow Blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* PAGE 1: HERO & STATS */}
      <Box
        id="hero-section"
        sx={{
          height: '100vh',
          scrollSnapAlign: 'start',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxSizing: 'border-box',
          p: { xs: 2.5, md: 4 },
        }}
      >
        {/* Navbar */}
        <Box sx={{ zIndex: 1, maxWidth: '1400px', width: '100%', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LogoIcon sx={{ fontSize: 36, color: '#6366F1', mr: 1 }} />
              <Typography
                variant="h5"
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
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ color: '#94A3B8', '&:hover': { color: '#F8FAFC' } }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{ borderRadius: 3 }}
              >
                Get Started
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Hero content */}
        <Container maxWidth="md" sx={{ zIndex: 1, my: 'auto', textAlign: 'center' }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                }}
              >
                A Premium Space for{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Creators
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography
                variant="h6"
                sx={{
                  color: '#94A3B8',
                  fontWeight: 400,
                  maxW: '650px',
                  mx: 'auto',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.25rem' },
                }}
              >
                PulseSocial combines the minimalism of Notion with the power of modern community feeds.
                Experience zero-lag updates, drag-and-drop media, and clean typography.
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
                sx={{ mb: 5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  className="glow-btn"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 3,
                  }}
                >
                  Join the Community
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: 3,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#F8FAFC',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.25)',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    },
                  }}
                >
                  Browse Public Feed
                </Button>
              </Stack>
            </motion.div>

            {/* Stats Panel (using CSS Grid for reliability) */}
            <motion.div variants={itemVariants}>
              <Paper
                className="glass-card"
                sx={{
                  p: 3,
                  borderRadius: 4,
                  maxWidth: '700px',
                  mx: 'auto',
                  background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(99, 102, 241, 0.03) 100%)',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: { xs: 2, sm: 3 },
                    textAlign: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#6366F1', fontSize: { xs: '1.4rem', sm: '2.2rem' } }}>
                      24k+
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Total Pulses
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6', fontSize: { xs: '1.4rem', sm: '2.2rem' } }}>
                      150k+
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Interactions
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#06B6D4', fontSize: { xs: '1.4rem', sm: '2.2rem' } }}>
                      99.9%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Uptime
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <Box sx={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconButton onClick={handleScrollToFeatures} sx={{ color: '#6366F1' }}>
              <ArrowDownIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </motion.div>
        </Box>
      </Box>

      {/* PAGE 2: FEATURES GRID & FOOTER */}
      <Box
        id="features-section"
        sx={{
          height: '100vh',
          scrollSnapAlign: 'start',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxSizing: 'border-box',
          p: { xs: 2.5, md: 4 },
        }}
      >
        <div /> {/* Spacing placeholder */}

        {/* Page 2 explicit Row/Col CSS Grid Section Layout */}
        <Container maxWidth="lg" sx={{ zIndex: 1, my: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', sm: '2.5rem' }, color: '#F8FAFC' }}>
              Platform Capabilities
            </Typography>
            <Typography variant="body1" sx={{ color: '#94A3B8' }}>
              Redefining micro-community interactions with modern engineering standards.
            </Typography>
          </Box>

          <Stack spacing={{ xs: 2, md: 3 }}>
            
            {/* Horizontal Section 1 (divided into 2 vertical columns) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Capability 1 */}
              <Card
                className="glass-card"
                sx={{
                  borderRadius: 4,
                  height: { xs: 'auto', sm: '150px', md: '170px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                    <ChatIcon sx={{ fontSize: 28, color: '#6366F1' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1.5, color: '#F8FAFC', fontSize: '1rem' }}>
                      Micro-Interactions
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.875rem' }}>
                    Engage with fluid post updates, expandable comments, and smooth spring-based animations.
                  </Typography>
                </CardContent>
              </Card>

              {/* Capability 2 */}
              <Card
                className="glass-card"
                sx={{
                  borderRadius: 4,
                  height: { xs: 'auto', sm: '150px', md: '170px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                    <ImageIcon sx={{ fontSize: 28, color: '#8B5CF6' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1.5, color: '#F8FAFC', fontSize: '1rem' }}>
                      Optimized Media
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.875rem' }}>
                    Drag & drop image uploads, client-side WebP compression, and lazy-loading for lightning fast pages.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Horizontal Section 2 (divided into 2 vertical columns) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Capability 3 */}
              <Card
                className="glass-card"
                sx={{
                  borderRadius: 4,
                  height: { xs: 'auto', sm: '150px', md: '170px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                    <FastIcon sx={{ fontSize: 28, color: '#06B6D4' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1.5, color: '#F8FAFC', fontSize: '1rem' }}>
                      Optimistic UI Updates
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.875rem' }}>
                    Like posts and add comments instantly with zero delay, backed by async state replication.
                  </Typography>
                </CardContent>
              </Card>

              {/* Capability 4 */}
              <Card
                className="glass-card"
                sx={{
                  borderRadius: 4,
                  height: { xs: 'auto', sm: '150px', md: '170px' },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                    <SecureIcon sx={{ fontSize: 28, color: '#10B981' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, ml: 1.5, color: '#F8FAFC', fontSize: '1rem' }}>
                      Hashed Authentication
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6, fontSize: '0.875rem' }}>
                    JWT sessions and salted bcrypt hashes ensure your credentials remain private.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

          </Stack>
        </Container>

        {/* Footer */}
        <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              &copy; 2026 PulseSocial. Engineered for performance.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography variant="caption" sx={{ color: '#94A3B8', cursor: 'pointer', '&:hover': { color: '#F8FAFC' } }}>
                Terms
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', cursor: 'pointer', '&:hover': { color: '#F8FAFC' } }}>
                Privacy Policy
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', cursor: 'pointer', '&:hover': { color: '#F8FAFC' } }}>
                API Status
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
