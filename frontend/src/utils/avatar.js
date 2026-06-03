/**
 * Generates a beautiful gradient avatar with initials using canvas.
 * Inspired by Linear and Vercel.
 */
export const getAvatarUrl = (username) => {
  if (!username) return '';

  // Return base64 image or placeholder if it's already an uploaded image
  if (username.startsWith('data:image') || username.startsWith('http')) {
    return username;
  }

  // Predefined beautiful gradient pairs
  const gradients = [
    ['#6366F1', '#8B5CF6'], // Indigo -> Purple
    ['#3B82F6', '#1D4ED8'], // Blue
    ['#10B981', '#059669'], // Emerald
    ['#F59E0B', '#D97706'], // Amber
    ['#EF4444', '#B91C1C'], // Red
    ['#EC4899', '#BE185D'], // Pink
    ['#06B6D4', '#0891B2'], // Cyan
    ['#84CC16', '#4D7C0F'], // Lime
  ];

  // Hash function to choose gradient
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  const [color1, color2] = gradients[index];

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Draw gradient background
    const grad = ctx.createLinearGradient(0, 0, 120, 120);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 120, 120);

    // Draw initials
    const initials = username.substring(0, 2).toUpperCase();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 50px Outfit, Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 60, 62);
  }

  return canvas.toDataURL('image/png');
};

/**
 * Compresses an image file (PNG/JPEG) using HTML5 Canvas to a maximum size
 * and outputs a WebP Base64 string for efficient database storage.
 */
export const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize calculation maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp data URL
        const dataUrl = canvas.toDataURL('image/webp', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
