import { useEffect, useState } from 'react'

/**
 * Animated typing effect that cycles through a list of words.
 * Respects prefers-reduced-motion.
 */
export function useTypewriter(words, { typeSpeed = 85, deleteSpeed = 40, holdTime = 1600 } = {}) {
  const list = Array.isArray(words) && words.length ? words.filter(Boolean) : ['']
  const signature = list.join('|')
  const [display, setDisplay] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(list[0] || '')
      return undefined
    }

    if (wordIndex >= list.length) {
      setWordIndex(0)
      return undefined
    }

    const current = list[wordIndex] || ''

    if (!deleting && display === current) {
      const hold = setTimeout(() => setDeleting(true), holdTime)
      return () => clearTimeout(hold)
    }

    if (deleting && display === '') {
      const pause = setTimeout(() => {
        setDeleting(false)
        setWordIndex((index) => (index + 1) % list.length)
      }, 260)
      return () => clearTimeout(pause)
    }

    const nextDelay = deleting ? deleteSpeed : typeSpeed
    const timer = setTimeout(() => {
      setDisplay(current.slice(0, display.length + (deleting ? -1 : 1)))
    }, nextDelay)
    return () => clearTimeout(timer)
    // `signature` intentionally stands in for the array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, deleting, wordIndex, signature, typeSpeed, deleteSpeed, holdTime])

  return display
}
