import { useState, useEffect, useRef, useMemo } from 'react'

/**
 * Image optimization utilities for TheMealDB images
 * TheMealDB provides images in these sizes:
 * - Full: /images/meals/xxx.jpg (~700px)
 * - Preview: /images/preview/xxx.jpg (~200px)
 * - Small: /images/meals/xxx-small.jpg (~250px) - available for some images
 */

// Generate optimized image sources for TheMealDB
function generateImageSources(src) {
  if (!src || !src.includes('themealdb.com')) {
    return { original: src, sources: [] }
  }

  const sources = []

  // Extract base URL and extension
  const baseUrl = src.replace(/\.(jpg|jpeg|png)$/i, '')
  const extension = src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg'

  // Preview image (~200px) - for blur placeholder and small screens
  const previewUrl = src.replace('/images/', '/images/preview/')

  // Small image variant (if available)
  const smallUrl = `${baseUrl}-small${extension}`

  // Generate srcset entries
  // TheMealDB images are typically 700x700
  sources.push({
    srcset: `${previewUrl} 200w, ${src} 700w`,
    sizes: '(max-width: 400px) 200px, 700px',
    type: 'image/jpeg',
  })

  return {
    original: src,
    preview: previewUrl,
    sources,
  }
}

// Check if browser supports WebP
function supportsWebP() {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * OptimizedImage - Responsive image with WebP support and blur-up loading
 *
 * Features:
 * - Responsive srcset for different screen sizes
 * - WebP format detection (for future CDN integration)
 * - Blur-up placeholder effect
 * - Lazy loading
 * - Error handling with fallback
 */
export default function OptimizedImage({
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
  const [hasWebPSupport] = useState(() => supportsWebP())
  const imgRef = useRef(null)
  const pictureRef = useRef(null)

  // Generate optimized sources
  const imageSources = useMemo(() => generateImageSources(src), [src])

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false)
    setIsError(false)
    setShowPlaceholder(true)

    // Preload the image
    if (src) {
      const img = new Image()

      // Use srcset if available for better preloading
      if (imageSources.sources.length > 0) {
        img.srcset = imageSources.sources[0].srcset
        img.sizes = sizes
      }
      img.src = src

      img.onload = () => {
        setIsLoaded(true)
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
  }, [src, imageSources, sizes, onLoad, onError])

  // Check if already cached
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

      {/* Optimized image with picture element for format selection */}
      <picture ref={pictureRef}>
        {/* WebP source - would be used with a CDN that provides WebP conversion */}
        {hasWebPSupport && src?.includes('themealdb.com') && (
          <source
            type="image/webp"
            srcSet={imageSources.sources[0]?.srcset?.replace(/\.(jpg|jpeg|png)/gi, '.webp')}
            sizes={sizes}
          />
        )}

        {/* JPEG/PNG sources with srcset for responsive images */}
        {imageSources.sources.map((source, index) => (
          <source
            key={index}
            type={source.type}
            srcSet={source.srcset}
            sizes={sizes}
          />
        ))}

        {/* Fallback img element */}
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
      </picture>
    </div>
  )
}

/**
 * ResponsiveImage - Simple responsive image without progressive loading
 * Use when you need just srcset without the blur-up effect
 */
export function ResponsiveImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  aspectRatio,
  objectFit = 'cover',
}) {
  const imageSources = useMemo(() => generateImageSources(src), [src])
  const [hasWebPSupport] = useState(() => supportsWebP())

  return (
    <picture>
      {/* WebP source */}
      {hasWebPSupport && src?.includes('themealdb.com') && (
        <source
          type="image/webp"
          srcSet={imageSources.sources[0]?.srcset?.replace(/\.(jpg|jpeg|png)/gi, '.webp')}
          sizes={sizes}
        />
      )}

      {/* Standard sources */}
      {imageSources.sources.map((source, index) => (
        <source
          key={index}
          type={source.type}
          srcSet={source.srcset}
          sizes={sizes}
        />
      ))}

      <img
        src={src}
        alt={alt}
        className={className}
        style={{ aspectRatio, objectFit }}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}

/**
 * ImageWithFallback - Image with multiple format fallbacks
 * Tries WebP first, then falls back to original format
 */
export function ImageWithFallback({
  src,
  webpSrc,
  alt,
  className = '',
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(webpSrc || src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (currentSrc === webpSrc && src !== webpSrc) {
      // WebP failed, try original
      setCurrentSrc(src)
    } else {
      setHasError(true)
    }
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  )
}

/**
 * Hook to generate responsive image props
 */
export function useResponsiveImage(src, options = {}) {
  const {
    sizes = '100vw',
    includeWebP = true,
  } = options

  return useMemo(() => {
    const sources = generateImageSources(src)
    const hasWebPSupport = supportsWebP()

    return {
      src,
      srcSet: sources.sources[0]?.srcset,
      sizes,
      // For picture element usage
      sources: sources.sources,
      webpSrcSet: hasWebPSupport && includeWebP
        ? sources.sources[0]?.srcset?.replace(/\.(jpg|jpeg|png)/gi, '.webp')
        : null,
      previewSrc: sources.preview,
    }
  }, [src, sizes, includeWebP])
}
