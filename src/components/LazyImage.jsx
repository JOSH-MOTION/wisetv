// src/components/LazyImage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, generatePlaceholder } from '../utils/imageUtils';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width = 800, 
  height = 600, 
  quality = 80,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
    if (onError) onError();
  };

  const optimizedSrc = getOptimizedImageUrl(src, { width, height, quality });
  const placeholderSrc = generatePlaceholder(width, height, 'Loading...');

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Placeholder */}
      <img
        src={placeholderSrc}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Main image */}
      {isInView && (
        <img
          src={error ? generatePlaceholder(width, height, 'Image not found') : optimizedSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;