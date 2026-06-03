import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CreatePostCard from '../components/CreatePostCard';
import PostCard from '../components/PostCard';
import {
  Box,
  Typography,
  Skeleton,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import { BlurOnRounded as LogoIcon } from '@mui/icons-material';

const HomeFeed = () => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const isFetchingRef = useRef(false);

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Fetch initial posts (Page 1)
  const fetchInitialPosts = useCallback(async () => {
    setLoading(true);
    isFetchingRef.current = true;
    try {
      const response = await api.posts.getAll(1, 10);
      setPosts(response.posts || []);
      setPage(1);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to retrieve feed. Try reloading.', 'error');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch next page (Infinite Scroll)
  const fetchNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || loadingMore) return;
    
    setLoadingMore(true);
    isFetchingRef.current = true;
    const nextPage = page + 1;
    
    try {
      const response = await api.posts.getAll(nextPage, 10);
      setPosts((prevPosts) => {
        // filter duplicates just in case
        const existingIds = new Set(prevPosts.map(p => p._id));
        const uniqueNewPosts = response.posts.filter(p => !existingIds.has(p._id));
        return [...prevPosts, ...uniqueNewPosts];
      });
      setPage(nextPage);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to load older posts.', 'error');
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore, loadingMore]);

  // Load feed on mount
  useEffect(() => {
    fetchInitialPosts();
  }, [fetchInitialPosts]);

  // Infinite scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage]);

  // Callback when a new post is created successfully
  const handlePostCreated = async (postPayload) => {
    try {
      const response = await api.posts.create(postPayload);
      if (response && response.post) {
        // Prepend new post to the feed instantly
        setPosts((prevPosts) => [response.post, ...prevPosts]);
        showToast('Your pulse was shared with the community!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to submit post.', 'error');
      throw err; // bubble up to stop loader in card
    }
  };

  // Render Post skeletons during initial load
  const renderSkeletons = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {[1, 2, 3].map((n) => (
        <Box key={n} sx={{ p: 2.5, borderRadius: 4, backgroundColor: 'background.paper', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1.5, bgcolor: 'rgba(255,255,255,0.06)' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="120px" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
              <Skeleton variant="text" width="60px" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
            <Skeleton variant="circular" width={24} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box>
      {/* Create Post Card at the top (only if logged in) */}
      {user ? (
        <CreatePostCard onPostCreated={handlePostCreated} showToast={showToast} />
      ) : (
        <Box
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 4,
            textAlign: 'center',
            backgroundColor: 'background.paper',
            border: '1px dashed rgba(255, 255, 255, 0.08)',
          }}
        >
          <Typography variant="body1" sx={{ color: '#94A3B8', mb: 2 }}>
            Join PulseSocial to create posts, upload images, and interact with the community.
          </Typography>
          <Button variant="contained" href="/login" sx={{ borderRadius: 3 }}>
            Sign In to Share
          </Button>
        </Box>
      )}

      {/* Posts Feed list */}
      {loading ? (
        renderSkeletons()
      ) : posts.length > 0 ? (
        <Box>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} showToast={showToast} />
          ))}

          {/* Load More/Infinite scroll status */}
          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={28} sx={{ color: '#6366F1' }} />
            </Box>
          )}

          {!hasMore && (
            <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 4, fontStyle: 'italic' }}>
              You've read all the pulses in the community.
            </Typography>
          )}
        </Box>
      ) : (
        // Empty State
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              p: 6,
              borderRadius: 4,
              backgroundColor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LogoIcon sx={{ fontSize: 60, color: '#94A3B8', opacity: 0.2, mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#F8FAFC' }}>
              No pulses yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8', maxW: '280px', mb: 3 }}>
              The feed is currently empty. Be the first user to share a pulse!
            </Typography>
          </Box>
        </motion.div>
      )}

      {/* Snackbar Toast System */}
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

export default HomeFeed;
