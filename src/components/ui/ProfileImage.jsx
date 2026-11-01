import { useEffect, useState } from 'react'

/**
 * Shows an image from /profile.jpg (or a custom URL).
 * If the image cannot load, a branded initials card is shown instead.
 */
export default function ProfileImage({ src, alt, initials = 'DV', className = '', loading = 'lazy' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={`profile-image profile-fallback ${className}`.trim()} role="img" aria-label={alt}>
        <span className="profile-fallback-initials">{initials}</span>
        <span className="profile-fallback-note">Photo coming soon</span>
      </div>
    )
  }

  return (
    <img
      className={`profile-image ${className}`.trim()}
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
