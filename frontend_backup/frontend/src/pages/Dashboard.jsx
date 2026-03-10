import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import Loader from '../components/Loader'
import PizzaCard from '../components/PizzaCard'

export default function Dashboard() {
  const { user } = useAuth()
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/pizza/options')
      .then(r => setOptions(r.data))
      .catch(() => setOptions({}))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const samplePizzas = [
    { _id: '1', name: 'Margherita Classic', base: options?.bases?.[0]?.itemName || 'Thin Crust', sauce: options?.sauces?.[0]?.itemName || 'Tomato', cheese: options?.cheese?.[0]?.itemName || 'Mozzarella', veggies: [], price: 299 },
    { _id: '2', name: 'Veggie Supreme', base: options?.bases?.[1]?.itemName || 'Thick Crust', sauce: options?.sauces?.[0]?.itemName || 'Pesto', cheese: options?.cheese?.[0]?.itemName || 'Cheddar', veggies: (options?.veggies || []).slice(0, 3).map(v => v.itemName), price: 349 },
    { _id: '3', name: 'Meat Lovers', base: options?.bases?.[0]?.itemName || 'Stuffed Crust', sauce: options?.sauces?.[1]?.itemName || 'BBQ', cheese: options?.cheese?.[0]?.itemName || 'Parmesan', veggies: [], price: 449 },
  ]

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, padding: '88px clamp(16px,4vw,40px) 60px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 50, padding: '5px 14px', marginBottom: 16, fontSize: '0.8rem', fontWeight: 600, color: '#dc2626' }}>
          {user?.role === 'admin' ? '🛡️ Admin Mode' : '👤 User Dashboard'}
        </div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#111827', marginBottom: 8 }}>
          Hey, welcome back 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>What are you building today?</p>
      </div>

      {/* Build your own CTA */}
      <div style={{
        borderRadius: 20, padding: '32px 36px',
        background: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(251,146,60,0.06))',
        border: '1px solid rgba(220,38,38,0.15)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20, marginBottom: 48,
      }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#111827', marginBottom: 8 }}>
            🍕 Build from Scratch
          </h2>
          <p style={{ color: '#6b7280', maxWidth: 420 }}>
            Choose your base, sauce, cheese, veggies, and toppings — calculate the price live.
          </p>
        </div>
        <Link to="/customize">
          <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '0.97rem' }}>Start Customizing →</button>
        </Link>
      </div>

      {/* Featured Pizzas */}
      <div style={{ marginBottom: 16 }}>
        <span className="section-label">Featured Builds</span>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#111827', marginTop: 8, marginBottom: 24 }}>Popular Combinations</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 22, marginBottom: 48 }}>
        {samplePizzas.map(p => <PizzaCard key={p._id} pizza={p} />)}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
        {[
          { icon: '📜', label: 'View My Orders', desc: 'Track all your past orders', path: '/orders' },
          { icon: '🍕', label: 'Customize Pizza', desc: 'Build a brand new pizza', path: '/customize' },
        ].map(item => (
          <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(255,255,255,0.85)',
              backdropFilter: 'blur(20px)', borderRadius: 16, padding: '22px 20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.07)', transition: 'all 0.3s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(220,38,38,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: 4 }}>{item.label}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
