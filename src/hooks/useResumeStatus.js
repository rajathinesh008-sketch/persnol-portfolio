import { useEffect, useState } from 'react'

async function pdfExists(url, signal) {
  try {
    const head = await fetch(url, { method: 'HEAD', cache: 'no-store', signal })
    const type = (head.headers.get('content-type') || '').toLowerCase()
    if (head.ok && type.includes('pdf')) return true
    if (!head.ok) return false

    // Some dev servers answer HEAD for missing files with index.html.
    // Probe the first bytes and verify the PDF signature.
    const probe = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-4' },
      cache: 'no-store',
      signal,
    })
    const probeType = (probe.headers.get('content-type') || '').toLowerCase()
    if (!probe.ok) return false
    const buffer = await probe.arrayBuffer()
    const signature = new TextDecoder().decode(buffer.slice(0, 5))
    return probeType.includes('pdf') || signature.startsWith('%PDF')
  } catch (error) {
    if (error?.name === 'AbortError') return null
    return false
  }
}

/**
 * Checks whether the configured resume file is actually present.
 * Returns 'checking' | 'available' | 'missing'.
 */
export function useResumeStatus(url = '/resume.pdf') {
  const [status, setStatus] = useState('checking')
  const [checkKey, setCheckKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    setStatus('checking')

    pdfExists(url, controller.signal).then((exists) => {
      if (!active || exists === null) return
      setStatus(exists ? 'available' : 'missing')
    })

    return () => {
      active = false
      controller.abort()
    }
  }, [url, checkKey])

  useEffect(() => {
    const recheck = () => setCheckKey((key) => key + 1)
    window.addEventListener('focus', recheck)
    return () => window.removeEventListener('focus', recheck)
  }, [])

  return status
}
