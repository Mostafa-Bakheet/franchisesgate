import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderSrc = '/placeholder.svg',
  threshold = 0.1,
  rootMargin = '50px',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Convert to WebP for local files
  const getWebPSrc = (originalSrc) => {
    if (!originalSrc || originalSrc.endsWith('.webp')) return originalSrc;
    if (originalSrc.includes('localhost') || originalSrc.includes('/uploads/')) {
      const ext = originalSrc.split('.').pop();
      if (['jpg', 'jpeg', 'png'].includes(ext.toLowerCase())) {
        return originalSrc.replace(/\.[^.]+$/, '.webp');
      }
    }
    return originalSrc;
  };

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (!hasError && imgSrc !== src) {
      setImgSrc(src);
      setHasError(true);
    } else {
      setIsLoaded(true);
    }
  };

  // WebP support detection
  const [supportsWebP, setSupportsWebP] = useState(true);
  
  useEffect(() => {
    const checkWebP = async () => {
      try {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
        webP.onload = () => setSupportsWebP(true);
        webP.onerror = () => setSupportsWebP(false);
      } catch {
        setSupportsWebP(false);
      }
    };
    checkWebP();
  }, []);

  const webpSrc = getWebPSrc(src);
  const displaySrc = supportsWebP ? webpSrc : imgSrc;

  return (
    <div 
      ref={imgRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#f3f4f6' }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      
      {isInView && (
        <picture>
          {supportsWebP && webpSrc !== src && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          <source srcSet={imgSrc} type={`image/${imgSrc.split('.').pop()}`} />
          <img
            src={displaySrc}
            alt={alt}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
            {...props}
          />
        </picture>
      )}
      
      <noscript>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} {...props} />
      </noscript>
    </div>
  );
};

export default LazyImage;
