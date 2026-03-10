import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const decoded = await login(email, password)
      addToast('Welcome back! 🍕', 'success')
      navigate(decoded.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '80px 20px', position: 'relative', zIndex: 1,
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍕</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', color: '#111827', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: '#6b7280' }}>Sign in to your PizzaCraft account</p>
        </div>

        <div className="glass-card" style={{ padding: '36px 32px' }}>
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.22)',
              borderLeft: '4px solid #dc2626', borderRadius: 12, padding: '12px 16px',
              marginBottom: 22, color: '#dc2626', fontSize: '0.88rem', fontWeight: 500,
            }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div style={{ marginBottom: 26, position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: 0, color: '#6b7280',
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <button type="submit" className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: '0.88rem', color: '#6b7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#dc2626', fontWeight: 600 }}>Create one</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
