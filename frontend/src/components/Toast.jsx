import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

function ToastItem({ toast, onRemove }) {
  const styles = {
    success: { accent: '#059669', bg: 'rgba(5,150,105,0.1)',  border: 'rgba(5,150,105,0.3)',  icon: '✓' },
    error:   { accent: '#dc2626', bg: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.3)',  icon: '✕' },
    warning: { accent: '#d97706', bg: 'rgba(217,119,6,0.1)',  border: 'rgba(217,119,6,0.3)',  icon: '⚠' },
    info:    { accent: '#2563eb', bg: 'rgba(37,99,235,0.1)',  border: 'rgba(37,99,235,0.25)', icon: 'ℹ' },
  }
  const s = styles[toast.type] || styles.info

  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${s.border}`,
        borderLeft: `4px solid ${s.accent}`,
        borderRadius: 14,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        minWidth: 280,
        maxWidth: 360,
        cursor: 'pointer',
        animation: 'slideInToast 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <span style={{
        width: 26, height: 26, borderRadius: '50%',
        background: s.bg, border: `1px solid ${s.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: s.accent, fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
      }}>{s.icon}</span>
      <span style={{ color: '#111827', fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>
        {toast.message}
      </span>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', top: 80, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
