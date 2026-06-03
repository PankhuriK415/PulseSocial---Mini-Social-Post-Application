import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { getAvatarUrl } from '../utils/avatar';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Grid,
  Divider,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  PostAddRounded as PostIcon,
  FavoriteRounded as HeartIcon,
  ChatBubbleRounded as CommentIcon,
  CalendarMonthRounded as CalendarIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikesReceived: 0,
    totalCommentsReceived: 0,
    activityTimeline: {}
  });
  
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.posts.getByUser(userId);
      setProfileUser(response.user);
      setPosts(response.posts || []);
      setStats(response.stats || {
        totalPosts: 0,
        totalLikesReceived: 0,
        totalCommentsReceived: 0,
        activityTimeline: {}
      });
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to load user profile.', 'error');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Generate date list for the last 7 days for the activity meter
  const getLast7DaysActivity = () => {
    const activity = [];
    const timeline = stats.activityTimeline || {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = timeline[dateStr] || 0;
      
      activity.push({
        dayName: date.toLocaleDateString(undefined, { weekday: 'short' }),
        dateLabel: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count,
      });
    }
    return activity;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={40} sx={{ color: '#6366F1' }} />
      </Box>
    );
  }

  if (!profileUser) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#111827' }}>
        <Typography variant="h6" sx={{ color: '#F8FAFC', mb: 2 }}>
          User not found
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8' }}>
          The user profile you are trying to view does not exist or has been removed.
        </Typography>
      </Paper>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === profileUser._id;
  const activityData = getLast7DaysActivity();
  const maxActivityCount = Math.max(...activityData.map(a => a.count), 1);

  return (
    <Box>
      {/* Profile Header Card */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 3,
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient blur decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0,
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, zIndex: 1, position: 'relative' }}>
          <Avatar
            src={getAvatarUrl(profileUser.avatar || profileUser.username)}
            sx={{ width: 90, height: 90, border: '2px solid #6366F1' }}
          />
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC', mb: 0.5 }}>
              {profileUser.username}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
              <CalendarIcon fontSize="inherit" /> Joined {new Date(profileUser.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </Typography>
            <Box
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 99,
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}
            >
              <Typography variant="caption" sx={{ color: '#818CF8', fontWeight: 600 }}>
                {isOwnProfile ? 'Your Profile' : 'Community Member'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Statistics Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Pulses Created', val: stats.totalPosts, icon: <PostIcon sx={{ color: '#6366F1' }} />, bg: 'rgba(99, 102, 241, 0.04)' },
          { label: 'Likes Received', val: stats.totalLikesReceived, icon: <HeartIcon sx={{ color: '#EF4444' }} />, bg: 'rgba(239, 68, 68, 0.04)' },
          { label: 'Comments Left', val: stats.totalCommentsReceived, icon: <CommentIcon sx={{ color: '#06B6D4' }} />, bg: 'rgba(6, 182, 212, 0.04)' }
        ].map((item, index) => (
          <Grid item xs={4} key={index}>
            <Paper
              sx={{
                p: 2.5,
                borderRadius: 4,
                backgroundColor: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'center',
                background: `linear-gradient(135deg, #111827 0%, ${item.bg} 100%)`,
              }}
            >
              <Box sx={{ display: 'inline-flex', p: 1, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.03)', mb: 1 }}>
                {item.icon}
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC', mb: 0.5 }}>
                {item.val}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Activity Statistics Panel */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          mb: 4,
          backgroundColor: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            Weekly Activity Frequency
          </Typography>
          <Tooltip title="Frequency of pulses published daily over the last 7 days">
            <InfoIcon sx={{ color: '#94A3B8', fontSize: 18, cursor: 'pointer' }} />
          </Tooltip>
        </Box>

        {/* Visual Bar chart using pure Material/CSS */}
        <Stack direction="row" justifyContent="space-around" alignItems="flex-end" sx={{ height: 120, pt: 1, px: 2 }}>
          {activityData.map((day, idx) => {
            const heightPercent = (day.count / maxActivityCount) * 100;
            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexGrow: 1,
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                {/* Bar */}
                <Tooltip title={`${day.count} pulses on ${day.dateLabel}`}>
                  <Box
                    component={motion.div}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, 5)}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    sx={{
                      width: '60%',
                      maxWidth: '24px',
                      borderRadius: '6px 6px 0 0',
                      background: day.count > 0 
                        ? 'linear-gradient(to top, #6366F1, #8B5CF6)' 
                        : 'rgba(255, 255, 255, 0.03)',
                      border: day.count > 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'linear-gradient(to top, #8B5CF6, #06B6D4)',
                      }
                    }}
                  />
                </Tooltip>
                {/* Label */}
                <Typography variant="caption" sx={{ color: '#94A3B8', mt: 1.5, fontSize: '0.7rem', fontWeight: 600 }}>
                  {day.dayName}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      {/* User Posts Header Divider */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
          Recent Pulses
        </Typography>
      </Box>

      {/* Profile Posts List */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post._id} post={post} showToast={showToast} />
        ))
      ) : (
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            backgroundColor: '#111827',
            border: '1px dashed rgba(255,255,255,0.08)',
          }}
        >
          <Typography variant="body2" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
            No pulses created yet by this user.
          </Typography>
        </Paper>
      )}

      {/* Snackbar toast notifications */}
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

export default ProfilePage;
