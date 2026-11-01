import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'

const ToastContext = createContext(null)

const ICONS = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  warning: FiAlertCircle,
  info: FiInfo,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const addToast = useCallback(
    (message, type = 'success', duration = 4000) => {
      if (!message) return
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((current) => [...current.slice(-2), { id, message, type }])
      const timer = setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
        timers.current.delete(id)
      }, duration)
      timers.current.set(id, timer)
    },
    [],
  )

  useEffect(() => {
    const currentTimers = timers.current
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer))
      currentTimers.clear()
    }
  }, [])

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || FiInfo
          return (
            <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
              <Icon className="toast-icon" aria-hidden="true" />
              <p>{toast.message}</p>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <FiX />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
