// src/utils/imageUtils.js
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl) return null;
  
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'webp'
  } = options;
  
  // If it's a Cloudinary URL, add optimization parameters
  if (originalUrl.includes('cloudinary.com')) {
    const baseUrl = originalUrl.split('/upload/')[0] + '/upload/';
    const imagePath = originalUrl.split('/upload/')[1];
    return `${baseUrl}w_${width},h_${height},c_fill,f_${format},q_${quality}/${imagePath}`;
  }
  
  // For Unsplash images, add optimization parameters
  if (originalUrl.includes('unsplash.com')) {
    return `${originalUrl}?w=${width}&h=${height}&q=${quality}&fm=${format}&fit=crop`;
  }
  
  // Return original URL if no optimization available
  return originalUrl;
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const generatePlaceholder = (width = 300, height = 200, text = 'Loading...') => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `)}`;
};