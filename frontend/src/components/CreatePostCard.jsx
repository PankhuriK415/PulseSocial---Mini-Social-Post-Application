import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAvatarUrl, compressImage } from '../utils/avatar';
import {
  Box,
  Paper,
  Avatar,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  ImageOutlined as ImageIcon,
  CloseRounded as CloseIcon,
  CloudUploadOutlined as UploadIcon,
} from '@mui/icons-material';

const CHARACTER_LIMIT = 280;

const CreatePostCard = ({ onPostCreated, showToast }) => {
  const { user } = useAuth();
  
  const [text, setText] = useState('');
  const [image, setImage] = useState(''); // Stores base64 string
  const [imageName, setImageName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  const fileInputRef = useRef(null);

  const handleTextChange = (e) => {
    if (e.target.value.length <= CHARACTER_LIMIT) {
      setText(e.target.value);
    }
  };

  // Process and compress image file
  const processImageFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    setCompressing(true);
    try {
      setImageName(file.name);
      // Compress to max 1000px width/height and convert to webp base64 string
      const compressedBase64 = await compressImage(file, 1000, 1000, 0.7);
      setImage(compressedBase64);
    } catch (err) {
      console.error('Image compression failed:', err);
      showToast('Failed to process image. Try a smaller file.', 'error');
    } finally {
      setCompressing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      showToast('Please enter text or upload an image to create a pulse.', 'error');
      return;
    }

    setLoading(true);
    try {
      await onPostCreated({ text, image });
      // Reset State on success
      setText('');
      setImage('');
      setImageName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const charPercent = Math.min((text.length / CHARACTER_LIMIT) * 100, 100);

  return (
    <Paper
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        p: 2.5,
        borderRadius: 4,
        mb: 3,
        backgroundColor: 'background.paper',
        border: isDragging ? '1px dashed #6366F1' : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isDragging ? '0 0 15px rgba(99, 102, 241, 0.15)' : '0 4px 20px rgba(0,0,0,0.15)',
        position: 'relative',
        transition: 'all 0.25s ease-in-out',
      }}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* User Avatar */}
        <Avatar
          src={getAvatarUrl(user?.avatar || user?.username)}
          sx={{ width: 44, height: 44 }}
        />

        {/* Text Input area */}
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            placeholder="Share what is pulsing in your community..."
            multiline
            minRows={2}
            maxRows={8}
            variant="standard"
            fullWidth
            value={text}
            onChange={handleTextChange}
            disabled={loading}
            InputProps={{
              disableUnderline: true,
              style: {
                color: '#F8FAFC',
                fontSize: '1rem',
                lineHeight: 1.5,
              },
            }}
          />

          {/* Compress status */}
          {compressing && (
            <Box sx={{ width: '100%', my: 2 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={12} /> Compressing image for instant feed delivery...
              </Typography>
            </Box>
          )}

          {/* Uploaded Image Preview */}
          {image && (
            <Box sx={{ position: 'relative', mt: 2, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img
                src={image}
                alt="Upload preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  color: '#F8FAFC',
                  '&:hover': {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    color: '#EF4444',
                  },
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  py: 0.5,
                  px: 1.5,
                  background: 'rgba(15, 23, 42, 0.65)',
                }}
              >
                <Typography variant="caption" noWrap sx={{ color: '#94A3B8' }}>
                  {imageName}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Divider */}
          <Box sx={{ mt: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', mb: 2 }} />

          {/* Bottom Toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={handleImageButtonClick}
                disabled={loading || compressing}
                sx={{
                  color: image ? '#6366F1' : '#94A3B8',
                  '&:hover': {
                    color: '#6366F1',
                    backgroundColor: 'rgba(99, 102, 241, 0.05)',
                  },
                }}
              >
                <ImageIcon />
              </IconButton>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: { xs: 'none', sm: 'block' } }}>
                Drag & drop image to attach
              </Typography>
            </Box>

            {/* Character indicator & Submit */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Character progress ring/bar */}
              {text.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: text.length >= CHARACTER_LIMIT - 20 ? '#EF4444' : '#94A3B8',
                    }}
                  >
                    {CHARACTER_LIMIT - text.length}
                  </Typography>
                  <Box sx={{ width: 40 }}>
                    <LinearProgress
                      variant="determinate"
                      value={charPercent}
                      color={text.length >= CHARACTER_LIMIT - 20 ? 'error' : 'primary'}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || compressing || (!text.trim() && !image)}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 0.8,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: '#F8FAFC' }} /> : 'Pulse'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Drag Over Overlay */}
      {isDragging && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 4,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <UploadIcon sx={{ fontSize: 48, color: '#6366F1', mb: 1 }} />
          <Typography variant="subtitle1" sx={{ color: '#F8FAFC', fontWeight: 700 }}>
            Drop image to upload
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            PulseSocial automatically optimizes it
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CreatePostCard;
