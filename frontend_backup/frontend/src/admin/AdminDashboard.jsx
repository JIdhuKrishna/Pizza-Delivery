import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import Loader from '../components/Loader'

function StatCard({ icon, label, value, color, loading }) {
  return (
    <div className="glass-card" style={{ padding: '26px 24px', transition: 'transform 0.3s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: `rgba(${color},0.1)`, border: `1px solid rgba(${color},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{icon}</div>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', background: `linear-gradient(135deg,rgb(${color}),rgba(${color},0.7))`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 4 }}>
        {loading ? <div style={{ width: 60, height: 32 }} className="shimmer" /> : value}
      </div>
      <div style={{ color: '#6b7280', fontSize: '0.88rem', fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([API.get('/order/'), API.get('/admin/inventory/')])
      .then(([o, i]) => { setOrders(o.data || []); setInventory(i.data || []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending = orders.filter(o => o.orderStatus !== 'Delivered').length
  const lowStock = inventory.filter(i => i.quantity <= i.threshold).length

  const stats = [
    { icon: '📜', label: 'Total Orders', value: orders.length, color: '37,99,235' },
    { icon: '⏳', label: 'Active Orders', value: pending, color: '217,119,6' },
    { icon: '🥡', label: 'Inventory Items', value: inventory.length, color: '5,150,105' },
    { icon: '⚠️', label: 'Low Stock Alerts', value: lowStock, color: '220,38,38' },
  ]

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 1280, margin: '0 auto', padding: '88px clamp(16px,4vw,40px) 60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: '#111827' }}>Admin Dashboard</h1>
            <span style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)', padding: '3px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700 }}>🛡️ Admin</span>
          </div>
          <p style={{ color: '#6b7280' }}>Welcome back! Here's your store at a glance.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/orders"><button className="btn-glass" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>Manage Orders</button></Link>
          <Link to="/admin/inventory"><button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>Manage Inventory</button></Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
        {/* Recent Orders */}
        <div className="glass-card" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Recent Orders</h2>
            <Link to="/admin/orders" style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>View all →</Link>
          </div>
          {loading ? <Loader fullscreen={false} size={36} /> : orders.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>No orders yet</p>
          ) : (
            [...orders].reverse().slice(0, 5).map(o => (
              <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>{o.userId?.name || o.userId?.email || 'Customer'}</div>
                  <div style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{o.pizzaBase} • {o.sauce}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#dc2626' }}>₹{o.price}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{o.orderStatus}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Low Stock */}
        <div className="glass-card" style={{ padding: '24px 26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Low Stock Alerts</h2>
            <Link to="/admin/inventory" style={{ color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>Manage →</Link>
          </div>
          {loading ? <Loader fullscreen={false} size={36} /> : lowStock === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
              <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>All items well stocked!</p>
            </div>
          ) : (
            inventory.filter(i => i.quantity <= i.threshold).map(item => (
              <div key={item._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderRadius: 11, marginBottom: 8,
                background: item.quantity === 0 ? 'rgba(220,38,38,0.07)' : 'rgba(217,119,6,0.07)',
                border: `1px solid ${item.quantity === 0 ? 'rgba(220,38,38,0.2)' : 'rgba(217,119,6,0.2)'}`,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>{item.itemName}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{item.category}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: item.quantity === 0 ? '#dc2626' : '#d97706' }}>{item.quantity} left</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>threshold: {item.threshold}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
