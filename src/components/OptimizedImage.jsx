// src/components/OptimizedImage.jsx
import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width = 800, 
  height = 600, 
  quality = 80,
  lazy = true,
  placeholder = true,
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef();

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return '';
    
    // If it's a Firebase Storage URL, add size parameters
    if (originalSrc.includes('firebasestorage.googleapis.com')) {
      return `${originalSrc}&w=${width}&h=${height}&q=${quality}`;
    }
    
    // If it's Unsplash, add optimization
    if (originalSrc.includes('unsplash.com')) {
      return `${originalSrc}?w=${width}&h=${height}&q=${quality}&fm=webp&fit=crop`;
    }
    
    return originalSrc;
  };

  // Generate placeholder
  const generatePlaceholder = () => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect x="50%" y="50%" width="32" height="32" transform="translate(-16,-16)" fill="#e5e7eb" rx="4"/>
        <text x="50%" y="65%" font-family="system-ui" font-size="12" fill="#9ca3af" text-anchor="middle">Loading...</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Generate error placeholder
  const generateErrorPlaceholder = () => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2"/>
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
              transform="translate(${width/2-12},${height/2-12})"/>
        <text x="50%" y="70%" font-family="system-ui" font-size="12" fill="#dc2626" text-anchor="middle">Failed to load</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // Update current source when src changes or comes into view
  useEffect(() => {
    if (isInView && src && !hasError) {
      setCurrentSrc(getOptimizedSrc(src));
    }
  }, [src, isInView, hasError, width, height, quality]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError();
  };

  const getSrc = () => {
    if (hasError) return generateErrorPlaceholder();
    if (!isInView || !currentSrc) return placeholder ? generatePlaceholder() : '';
    return currentSrc;
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden bg-gray-100 ${className}`} {...props}>
      <img
        src={getSrc()}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded && !hasError ? 'opacity-100' : 'opacity-90'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
      />
      
      {/* Loading indicator for non-placeholder mode */}
      {!placeholder && !isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-red-600"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;