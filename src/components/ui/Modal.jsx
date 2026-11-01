import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md' }) {
  const panelRef = useRef(null)
  const restoreRef = useRef(null)
  const titleId = useId()

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return undefined
    restoreRef.current = document.activeElement

    const panel = panelRef.current
    if (panel) {
      const firstField = panel.querySelector('input, textarea, select')
      if (firstField) firstField.focus()
      else panel.focus()
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose?.()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter(
        (node) => node.offsetParent !== null,
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="modal-head">
          <div>
            <h3 className="modal-title" id={titleId}>
              {title}
            </h3>
            {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close dialog">
            <FiX />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-actions">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
