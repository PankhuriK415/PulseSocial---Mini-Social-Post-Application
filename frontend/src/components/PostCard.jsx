import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getAvatarUrl } from '../utils/avatar';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  FavoriteBorderRounded as LikeOutlineIcon,
  FavoriteRounded as LikeFilledIcon,
  ChatBubbleOutlineRounded as CommentIcon,
  SendRounded as SendIcon,
} from '@mui/icons-material';

// Custom Relative Time Formatter
const formatRelativeTime = (dateInput) => {
  if (!dateInput) return '';
  const now = new Date();
  const past = new Date(dateInput);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const elapsed = now - past;

  if (elapsed < msPerMinute) {
    return 'just now';
  } else if (elapsed < msPerHour) {
    const mins = Math.round(elapsed / msPerMinute);
    return `${mins}m ago`;
  } else if (elapsed < msPerDay) {
    const hrs = Math.round(elapsed / msPerHour);
    return `${hrs}h ago`;
  } else {
    const days = Math.round(elapsed / msPerDay);
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

const PostCard = ({ post, showToast }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local state for interactive features
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Check if current user liked the post
  const isLiked = user ? likes.some((like) => like.userId === user._id) : false;

  // Handle Like/Unlike with Optimistic UI Updates
  const handleLike = async () => {
    if (!user) {
      showToast('You must be logged in to like posts.', 'warning');
      navigate('/login');
      return;
    }

    // Capture current state for rollback on error
    const previousLikes = [...likes];

    // Optimistically update the state
    if (isLiked) {
      // Remove current user like
      setLikes(likes.filter((like) => like.userId !== user._id));
    } else {
      // Add current user like
      setLikes([...likes, { userId: user._id, username: user.username }]);
    }

    try {
      const response = await api.posts.toggleLike(post._id);
      // Sync state with server response
      if (response && response.likes) {
        setLikes(response.likes);
      }
    } catch (err) {
      console.error('Like toggle failed:', err);
      // Rollback to original state on error
      setLikes(previousLikes);
      showToast('Failed to update like. Please try again.', 'error');
    }
  };

  // Expand / collapse comment drawer
  const toggleComments = () => {
    setIsCommentsExpanded(!isCommentsExpanded);
  };

  // Post comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('You must be logged in to comment.', 'warning');
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await api.posts.addComment(post._id, commentText.trim());
      if (response && response.comments) {
        setComments(response.comments);
        setCommentText('');
        showToast('Comment added successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Failed to submit comment.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.008 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 4,
          mb: 3,
          backgroundColor: 'background.paper',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease-in-out',
          '&:hover': {
            borderColor: 'rgba(99, 102, 241, 0.25)',
          },
        }}
      >
        {/* Post Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => handleUserClick(post.userId)}
          >
            <Avatar
              src={getAvatarUrl(post.userId?.avatar || post.username)}
              sx={{ width: 40, height: 40, mr: 1.5 }}
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: '#F8FAFC',
                  '&:hover': { color: '#6366F1', textDecoration: 'underline' },
                }}
              >
                {post.username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                {formatRelativeTime(post.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Post Content */}
        <Typography
          variant="body1"
          sx={{
            color: '#F8FAFC',
            mb: post.image ? 2 : 1,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {post.text}
        </Typography>

        {/* Post Image */}
        {post.image && (
          <Box
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              mb: 2.5,
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <img
              src={post.image}
              alt="Post attachment"
              loading="lazy"
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        )}

        {/* Interaction Actions Row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={handleLike}
              sx={{
                color: isLiked ? '#EF4444' : '#94A3B8',
                padding: 1,
                '&:hover': {
                  color: '#EF4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                },
                transition: 'transform 0.1s ease',
                '&:active': {
                  transform: 'scale(1.2)',
                },
              }}
            >
              {isLiked ? <LikeFilledIcon fontSize="small" /> : <LikeOutlineIcon fontSize="small" />}
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, color: isLiked ? '#EF4444' : '#94A3B8', minWidth: 16 }}>
              {likes.length}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              onClick={toggleComments}
              sx={{
                color: isCommentsExpanded ? '#6366F1' : '#94A3B8',
                padding: 1,
                '&:hover': {
                  color: '#6366F1',
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, color: isCommentsExpanded ? '#6366F1' : '#94A3B8' }}>
              {comments.length}
            </Typography>
          </Stack>
        </Box>

        {/* Expandable Comments Drawer Section */}
        <AnimatePresence>
          {isCommentsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Box sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                {/* Comments List */}
                {comments.length > 0 ? (
                  <Stack spacing={2} sx={{ mb: 2.5, maxH: '250px', overflowY: 'auto', pr: 1 }}>
                    {comments.map((comment, idx) => (
                      <Box key={idx} sx={{ display: 'flex', gap: 1.5 }}>
                        <Avatar
                          src={getAvatarUrl(comment.userId?.avatar || comment.username)}
                          sx={{ width: 28, height: 28 }}
                        />
                        <Box sx={{ flexGrow: 1, backgroundColor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.03)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography
                              variant="caption"
                              onClick={() => handleUserClick(comment.userId)}
                              sx={{
                                fontWeight: 700,
                                color: '#F8FAFC',
                                cursor: 'pointer',
                                '&:hover': { color: '#6366F1', textDecoration: 'underline' }
                              }}
                            >
                              {comment.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem' }}>
                              {formatRelativeTime(comment.createdAt)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#F8FAFC', wordBreak: 'break-word' }}>
                            {comment.text}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" sx={{ color: '#94A3B8', py: 2, textAlign: 'center', fontStyle: 'italic' }}>
                    No comments yet. Be the first to share your thoughts!
                  </Typography>
                )}

                {/* Add Comment Input Bar */}
                {user ? (
                  <form onSubmit={handleCommentSubmit}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Avatar
                        src={getAvatarUrl(user.avatar || user.username)}
                        sx={{ width: 28, height: 28 }}
                      />
                      <TextField
                        placeholder="Add a comment..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={submittingComment}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            borderRadius: 3,
                          }
                        }}
                        inputProps={{ style: { color: '#F8FAFC', fontSize: '0.875rem' } }}
                      />
                      <IconButton
                        type="submit"
                        disabled={submittingComment || !commentText.trim()}
                        sx={{
                          color: '#6366F1',
                          '&:hover': {
                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                          },
                          '&.Mui-disabled': {
                            color: 'rgba(255, 255, 255, 0.12)',
                          }
                        }}
                      >
                        {submittingComment ? <CircularProgress size={20} /> : <SendIcon fontSize="small" />}
                      </IconButton>
                    </Box>
                  </form>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94A3B8',
                      py: 1,
                      textAlign: 'center',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      borderRadius: 3,
                      border: '1px dashed rgba(255,255,255,0.08)'
                    }}
                  >
                    Please{' '}
                    <Link to="/login" style={{ color: '#6366F1', fontWeight: 600 }}>
                      sign in
                    </Link>{' '}
                    to leave a comment.
                  </Typography>
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
};

export default PostCard;
