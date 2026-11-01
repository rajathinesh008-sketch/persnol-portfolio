const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function uid(prefix = 'id') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function normalizeUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (raw.startsWith('/') || raw.startsWith('#') || raw.startsWith('mailto:')) return raw
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
}

export function isSafeLink(value) {
  const raw = String(value || '').trim()
  if (!raw) return false
  if (raw.startsWith('/') || raw.startsWith('mailto:')) return true
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function safeLink(value) {
  const raw = String(value || '').trim()
  return isSafeLink(raw) ? raw : ''
}

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim())
}

export function isHttpUrl(value) {
  const raw = String(value || '').trim()
  if (!raw) return true
  if (raw.startsWith('/')) return true
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Accepts "YYYY-MM" (month input) or a full date string.
 * Returns "Jan 2025" or an empty string.
 */
export function formatMonth(value) {
  if (!value) return ''
  const parts = String(value).split('-')
  const year = Number(parts[0])
  const month = Number(parts[1] || 1)
  if (!Number.isFinite(year) || !Number.isFinite(month)) return String(value)
  const date = new Date(year, Math.min(Math.max(month - 1, 0), 11), 1)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date)
}

export function formatRange(start, end, current = false) {
  const from = formatMonth(start)
  const to = current ? 'Present' : formatMonth(end)
  if (!from && !to) return ''
  if (!from) return to
  return `${from} — ${to || 'Present'}`
}

export function initialsOf(name = '') {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'DV'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export async function copyText(text) {
  const value = String(text || '')
  if (!value) throw new Error('Nothing to copy')
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value)
    return true
  }
  const textArea = document.createElement('textarea')
  textArea.value = value
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textArea)
  if (!ok) throw new Error('Copy failed')
  return true
}

export function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
