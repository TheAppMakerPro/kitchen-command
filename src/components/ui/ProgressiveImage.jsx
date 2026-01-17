import { useState, useEffect, useRef, useMemo } from 'react'

/**
 * Generate optimized image sources for TheMealDB images
 * TheMealDB provides full-size images at /images/media/meals/xxx.jpg
 * Note: TheMealDB doesn't have separate preview/thumbnail URLs
 */
function generateImageSources(src) {
  if (!src) return { original: src, preview: null, srcset: null }

  const isTheMealDB = src.includes('themealdb.com')

  if (!isTheMealDB) {
    return { original: src, preview: null, srcset: null }
  }

  // TheMealDB doesn't provide separate preview URLs, so we use the same image
  // The srcset just provides the full image at its natural size
  return {
    original: src,
    preview: null, // No preview available from TheMealDB
    srcset: null,  // Single image source
  }
}


/**
 * ProgressiveImage - Loads images with smooth transition effects
 * Features:
 * - Shimmer placeholder during loading
 * - Lazy loading with priority option
 * - Error handling with fallback
 * - Smooth opacity transition on load
 */
export default function ProgressiveImage({
  src,
  alt,
  className = '',
  placeholderColor = '#f3f4f6',
  aspectRatio = '4/3',
  objectFit = 'cover',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  onLoad,
  onError,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const imgRef = useRef(null)

  // Generate optimized image sources (for future CDN integration)
  const imageSources = useMemo(() => generateImageSources(src), [src])

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false)
    setIsError(false)
    setShowPlaceholder(true)

    // Preload the full image
    if (src) {
      const img = new Image()
      img.src = src

      img.onload = () => {
        setIsLoaded(true)
        // Delay hiding placeholder for smooth transition
        setTimeout(() => setShowPlaceholder(false), 300)
        onLoad?.()
      }

      img.onerror = () => {
        setIsError(true)
        setShowPlaceholder(false)
        onError?.()
      }

      return () => {
        img.onload = null
        img.onerror = null
      }
    }
  }, [src, onLoad, onError])

  // If already cached, show immediately
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight !== 0) {
      setIsLoaded(true)
      setShowPlaceholder(false)
    }
  }, [])

  if (isError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ aspectRatio }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center text-gray-400 dark:text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio, backgroundColor: placeholderColor }}
    >
      {/* Blurred placeholder */}
      {showPlaceholder && imageSources.preview && (
        <img
          src={imageSources.preview}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 transition-opacity duration-300"
          style={{
            objectFit,
            opacity: isLoaded ? 0 : 1,
          }}
        />
      )}

      {/* Shimmer placeholder when no preview available */}
      {showPlaceholder && !imageSources.preview && (
        <div
          className="absolute inset-0 skeleton"
          style={{ opacity: isLoaded ? 0 : 1 }}
          aria-hidden="true"
        />
      )}

      {/* Main image element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectFit }}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchpriority={priority ? 'high' : 'auto'}
      />
    </div>
  )
}

/**
 * ProgressiveAvatar - Circular progressive image for avatars/thumbnails
 */
export function ProgressiveAvatar({
  src,
  alt,
  size = 'md',
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  }

  return (
    <ProgressiveImage
      src={src}
      alt={alt}
      className={`rounded-full ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aspectRatio="1/1"
    />
  )
}

/**
 * ProgressiveBackground - Full-width background image with blur-up
 */
export function ProgressiveBackground({
  src,
  alt,
  children,
  className = '',
  overlayClassName = '',
}) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (src) {
      const img = new Image()
      img.src = src
      img.onload = () => setIsLoaded(true)
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
          isLoaded ? 'blur-0 scale-100' : 'blur-lg scale-110'
        }`}
        style={{ backgroundImage: `url(${src})` }}
      />

      {/* Overlay */}
      {overlayClassName && (
        <div className={`absolute inset-0 ${overlayClassName}`} />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
