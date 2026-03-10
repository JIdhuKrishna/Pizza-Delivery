import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const navLinks = user
    ? isAdmin()
      ? [
          { path: '/admin', label: 'Dashboard' },
          { path: '/admin/orders', label: 'Orders' },
          { path: '/admin/inventory', label: 'Inventory' },
        ]
      : [
          { path: '/dashboard', label: 'Browse' },
          { path: '/customize', label: 'Customize' },
          { path: '/orders', label: 'My Orders' },
        ]
    : [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Sign In' },
        { path: '/register', label: 'Register' },
      ]

  function handleLogout() {
    setMenuOpen(false)
    logout()
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 68,
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center',
      padding: '0 clamp(16px,4vw,40px)',
      gap: 8,
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: "'Syne',sans-serif",
        fontWeight: 800, fontSize: '1.35rem',
        background: 'linear-gradient(135deg,#dc2626,#e11d48,#f97316)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        textDecoration: 'none', marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        🍕 PizzaCraft
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navLinks.map(link => (
          <Link key={link.path} to={link.path} style={{
            padding: '8px 16px',
            borderRadius: 50,
            fontWeight: 500,
            fontSize: '0.9rem',
            textDecoration: 'none',
            color: isActive(link.path) ? '#dc2626' : '#374151',
            background: isActive(link.path) ? 'rgba(220,38,38,0.08)' : 'transparent',
            border: isActive(link.path) ? '1px solid rgba(220,38,38,0.2)' : '1px solid transparent',
            transition: 'all 0.25s',
            whiteSpace: 'nowrap',
          }}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Auth */}
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg,#dc2626,#e11d48)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.85rem',
            boxShadow: '0 2px 10px rgba(220,38,38,0.3)', flexShrink: 0,
          }}>
            {user.role === 'admin' ? 'A' : 'U'}
          </div>
          <button className="btn-glass" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <Link to="/login">
            <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Sign In</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Get Started</button>
          </Link>
        </div>
      )}
    </nav>
  )
}
