import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function passStrength(pw) {
  if (pw.length < 6) return { level: 0, label: 'Too short', color: '#9ca3af' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { level: 1, label: 'Weak', color: '#dc2626' }
  if (s === 2) return { level: 2, label: 'Medium', color: '#d97706' }
  return { level: 3, label: 'Strong', color: '#059669' }
}

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { register, user } = useAuth()
  const navigate = useNavigate()

  if (user) { navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true }); return null }

  const strength = passStrength(password)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('All fields are required.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await register(name, email, password, role)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div className="glass-card" style={{ maxWidth: 440, width: '100%', padding: '48px 36px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>✉️</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.7rem', color: '#111827', marginBottom: 12 }}>Check your email!</h2>
          <p style={{ color: '#6b7280', lineHeight: 1.65, marginBottom: 28 }}>
            We sent a verification link to <strong style={{ color: '#111827' }}>{email}</strong>.<br />Click it to activate your account.
          </p>
          <Link to="/login"><button className="btn-primary" style={{ padding: '13px 36px' }}>Go to Login →</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '88px 20px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍕</div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', color: '#111827', marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: '#6b7280' }}>Join PizzaCraft and start building</p>
        </div>

        <div className="glass-card" style={{ padding: '36px 32px' }}>
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.22)', borderLeft: '4px solid #dc2626', borderRadius: 12, padding: '12px 16px', marginBottom: 22, color: '#dc2626', fontSize: '0.88rem', fontWeight: 500 }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Full Name</label>
              <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 7, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: 0, color: '#6b7280' }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
              {password && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, transition: 'background 0.3s', background: i <= strength.level ? strength.color : 'rgba(0,0,0,0.08)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', marginBottom: 10, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Account Type</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {['user', 'admin'].map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)} style={{
                    flex: 1, padding: '10px', borderRadius: 12, fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.25s',
                    background: role === r ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'rgba(0,0,0,0.04)',
                    color: role === r ? '#fff' : '#374151',
                    border: role === r ? 'none' : '1.5px solid rgba(0,0,0,0.1)',
                    boxShadow: role === r ? '0 4px 16px rgba(220,38,38,0.3)' : 'none',
                  }}>{r === 'user' ? '👤 User' : '🛡️ Admin'}</button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: '0.88rem', color: '#6b7280' }}>
            Already have an account?{' '}<Link to="/login" style={{ color: '#dc2626', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
