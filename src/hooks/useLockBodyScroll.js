import { useEffect } from 'react'

let lockCount = 0
let previousOverflow = ''

/** Prevent background scrolling while a modal is open (handles stacked modals). */
export function useLockBodyScroll(locked = true) {
  useEffect(() => {
    if (!locked) return undefined
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1

    return () => {
      lockCount = Math.max(lockCount - 1, 0)
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow
        previousOverflow = ''
      }
    }
  }, [locked])
}
