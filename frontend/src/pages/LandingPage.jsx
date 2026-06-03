import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  BlurOnRounded as LogoIcon,
  ForumRounded as ChatIcon,
  FavoriteRounded as HeartIcon,
  ImageRounded as ImageIcon,
  SpeedRounded as FastIcon,
  LockRounded as SecureIcon,
  GroupRounded as CommunityIcon,
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 60,
        damping: 15,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, rotate: -45, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      },
    },
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const features = [
    {
      icon: <ChatIcon sx={{ fontSize: 32, color: '#6366F1' }} />,
      title: 'Micro-Interactions',
      desc: 'Engage with fluid post updates, expandable comments, and smooth spring-based animations.',
    },
    {
      icon: <ImageIcon sx={{ fontSize: 32, color: '#8B5CF6' }} />,
      title: 'Optimized Media',
      desc: 'Drag & drop image uploads, client-side WebP compression, and lazy-loading for lightning fast pages.',
    },
    {
      icon: <FastIcon sx={{ fontSize: 32, color: '#06B6D4' }} />,
      title: 'Optimistic UI Updates',
      desc: 'Like posts and add comments instantly with zero delay, backed by async state replication.',
    },
    {
      icon: <SecureIcon sx={{ fontSize: 32, color: '#10B981' }} />,
      title: 'Hashed Authentication',
      desc: 'JWT sessions and salted bcrypt hashes ensure your account credentials remain strictly private.',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#0F172A',
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        py: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Background Decorative Glow Blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Landing Navbar */}
      <Container maxWidth="lg" sx={{ zIndex: 1, mb: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              variants={logoVariants}
              initial="hidden"
              animate={['visible', 'animate']}
              style={{ display: 'inline-block' }}
            >
              <LogoIcon sx={{ fontSize: 40, color: '#6366F1', mr: 1 }} />
            </motion.div>
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
          <Stack direction="row" spacing={2}>
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
      </Container>

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ zIndex: 1, textSelf: 'center', textAlign: 'center', mb: { xs: 8, md: 12 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 99,
                border: '1px solid rgba(99, 102, 241, 0.3)',
                background: 'rgba(99, 102, 241, 0.05)',
                mb: 3,
              }}
            >
              <CommunityIcon sx={{ fontSize: 16, color: '#6366F1' }} />
              <Typography variant="caption" sx={{ color: '#818CF8', fontWeight: 600, letterSpacing: '0.05em' }}>
                THE NEXT-GEN SOCIAL SPACE
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: { xs: 1.2, md: 1.1 },
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
                Modern Creators
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography
              variant="h6"
              sx={{
                color: '#94A3B8',
                fontWeight: 400,
                maxW: '600px',
                mx: 'auto',
                mb: 5,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.2rem' },
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
              alignItems="center"
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
                  width: { xs: '100%', sm: 'auto' },
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
                  width: { xs: '100%', sm: 'auto' },
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
        </motion.div>
      </Container>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ zIndex: 1, mb: { xs: 8, md: 16 } }}>
        <Grid container spacing={4}>
          {features.map((feat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="glass-card"
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feat.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#F8FAFC' }}>
                      {feat.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.6 }}>
                      {feat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Community Stats Section */}
      <Container maxWidth="md" sx={{ zIndex: 1, mb: { xs: 8, md: 16 } }}>
        <Paper
          className="glass-card"
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(99, 102, 241, 0.04) 100%)',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#F8FAFC' }}>
            Powered by Active Creators
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#6366F1', mb: 1 }}>
                24k+
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                Total Pulses
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#8B5CF6', mb: 1 }}>
                150k+
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                Interactions
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#06B6D4', mb: 1 }}>
                99.9%
              </Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                Uptime
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Footer */}
      <Box sx={{ mt: 'auto', py: 4, borderTop: '1px solid rgba(255, 255, 255, 0.05)', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              &copy; {new Date().getFullYear()} PulseSocial. Engineered for performance.
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
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
