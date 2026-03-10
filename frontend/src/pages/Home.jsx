import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import Loader from '../components/Loader'

const PizzaModel = lazy(() => import('../components/PizzaModel'))

export default function Home() {
  const { user } = useAuth()
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/pizza')
      .then(res => setPizzas(res.data))
      .catch(err => console.error('Failed to fetch pizzas', err))
      .finally(() => setLoading(false))
  }, [])

  const features = [
    { icon: '🥗', title: 'Fresh Ingredients', desc: 'Pick from premium bases, sauces, cheeses, veggies, and meats — all sourced fresh.', rgb: '5,150,105' },
    { icon: '⚡', title: 'Real-Time Tracking', desc: 'Follow your order live through 4 stages — from kitchen to your doorstep.', rgb: '220,38,38' },
    { icon: '💳', title: 'Secure Payments', desc: 'Pay safely with Razorpay — UPI, cards, wallets, and net banking supported.', rgb: '37,99,235' },
  ]

  const steps = [
    { num: 1, icon: '📧', title: 'Create Account', desc: 'Register and verify your email to get started in seconds.' },
    { num: 2, icon: '🍕', title: 'Build Your Pizza', desc: 'Choose your base, sauce, cheese, veggies, and meat toppings.' },
    { num: 3, icon: '💳', title: 'Pay Securely', desc: 'Complete checkout with Razorpay — quick and safe.' },
    { num: 4, icon: '🚀', title: 'Track Live', desc: 'Watch your pizza move through each stage until delivered.' },
  ]

  return (
    <div className="page-enter" style={{ paddingTop: 68 }}>
      {/* ── HERO ── */}
      <section style={{
        minHeight: '92vh',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(20px,6vw,80px)',
        maxWidth: 1280, margin: '0 auto',
        gap: 48, flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 50, padding: '6px 16px',
            marginBottom: 28, fontSize: '0.82rem', fontWeight: 600, color: '#dc2626',
          }}>
            🍕 Real Customization. Real Speed.
          </div>
          <h1 style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 'clamp(2.4rem,5vw,4rem)', fontWeight: 800,
            lineHeight: 1.15, color: '#111827', marginBottom: 18,
          }}>
            Craft Your{' '}
            <span className="gradient-text">Perfect Pizza</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Hand-picked ingredients, built exactly your way.
            Fresh. Hot. Delivered straight to your door.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to={user ? '/customize' : '/register'}>
              <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                Build My Pizza →
              </button>
            </Link>
            {!user && (
              <Link to="/login">
                <button className="btn-outline" style={{ padding: '14px 32px', fontSize: '1rem' }}>Sign In</button>
              </Link>
            )}
          </div>
        </div>

        {/* 3D Pizza */}
        <div style={{
          flex: 1, minWidth: 280, height: 420,
          borderRadius: 28,
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.85)',
          boxShadow: '0 20px 60px rgba(220,38,38,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Suspense fallback={<div style={{ fontSize: '6rem' }} className="bob">🍕</div>}>
            <PizzaModel />
          </Suspense>
        </div>
      </section>

      {/* ── PRE-DEFINED PIZZAS ── */}
      <section style={{ padding: '80px clamp(20px,6vw,80px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label">Our Classics</span>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#111827', marginTop: 10 }}>
            Popular Picks Ready to Go
          </h2>
        </div>
        
        {loading ? <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 30 }}>
            {pizzas.map(pizza => (
              <div key={pizza._id} className="glass-card" style={{ padding: 0, overflow: 'hidden', transition: 'var(--transition)' }}>
                <div style={{ height: 200, width: '100%', overflow: 'hidden' }}>
                  <img src={pizza.image} alt={pizza.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} 
                    onMouseEnter={e => e.target.style.transform = 'scale(1.1)'} 
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.25rem' }}>{pizza.name}</h3>
                    <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.1rem' }}>₹{pizza.price}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20, minHeight: 40 }}>{pizza.description}</p>
                  <Link to="/customize" state={{ pizza }}>
                    <button className="btn-glass" style={{ width: '100%', justifyContent: 'center' }}>
                      Order & Customize
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px clamp(20px,6vw,80px)', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="section-label">Why PizzaCraft?</span>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#111827', marginTop: 10 }}>
            Everything you need, nothing you don't
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 24 }}>
          {features.map(f => (
            <div key={f.title} className="glass-card" style={{ padding: '32px 28px', transition: 'transform 0.35s,box-shadow 0.35s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1),inset 0 1px 0 rgba(255,255,255,0.9)' }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `rgba(${f.rgb},0.1)`, border: `1px solid rgba(${f.rgb},0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', marginBottom: 20,
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#111827', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.65, fontSize: '0.92rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px clamp(20px,6vw,80px)', background: 'rgba(220,38,38,0.02)', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-label">Simple Process</span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#111827', marginTop: 10 }}>
              From craving to doorstep in 4 steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 20 }}>
            {steps.map(step => (
              <div key={step.num} style={{ textAlign: 'center', padding: '32px 16px' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.25rem',
                  margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(220,38,38,0.3)',
                }}>{step.num}</div>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.98rem', color: '#111827', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.87rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px clamp(20px,6vw,80px)', textAlign: 'center', maxWidth: 1280, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#111827', marginBottom: 16 }}>
          Ready to build your pizza?
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 36, fontSize: '1.05rem' }}>Join thousands crafting their perfect pie.</p>
        <Link to={user ? '/customize' : '/register'}>
          <button className="btn-primary" style={{ padding: '16px 44px', fontSize: '1.05rem' }}>Get Started Free →</button>
        </Link>
      </section>

      <footer style={{
        background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.06)', padding: '20px 40px',
        textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem',
      }}>
        © 2026 PizzaCraft. All rights reserved. 🍕
      </footer>
    </div>
  )
}
