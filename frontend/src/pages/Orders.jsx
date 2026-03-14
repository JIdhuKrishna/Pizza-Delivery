import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import Loader from '../components/Loader'

const STATUS_STEPS = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered']

const STATUS_COLORS = {
  'Order Received': '#2563eb',
  'In the Kitchen': '#d97706',
  'Sent to Delivery': '#7c3aed',
  'Delivered': '#059669',
}

function StatusTracker({ status }) {
  const current = STATUS_STEPS.indexOf(status)
  const isDelivered = status === 'Delivered'

  const getCircleBg = (i) => {
    if (!i <= current) return 'rgba(0,0,0,0.08)'
    if (i === 3 && isDelivered) return 'linear-gradient(135deg,#059669,#047857)' // green for Delivered
    if (i <= current) return 'linear-gradient(135deg,#dc2626,#b91c1c)'
    return 'rgba(0,0,0,0.08)'
  }

  const getLineBg = (i) => {
    if (i < current) {
      if (isDelivered) return 'linear-gradient(90deg,#dc2626,#059669)'
      return 'linear-gradient(90deg,#dc2626,#e11d48)'
    }
    return 'rgba(0,0,0,0.08)'
  }

  const getLabelColor = (i) => {
    if (i === current && isDelivered) return '#059669'
    if (i === current) return '#dc2626'
    if (i < current) return '#374151'
    return '#9ca3af'
  }

  return (
    <div style={{ marginTop: 16, marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {STATUS_STEPS.map((step, i) => (
          <>
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i <= current ? getCircleBg(i) : 'rgba(0,0,0,0.08)',
                border: i <= current ? 'none' : '2px solid rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: i === current && isDelivered ? '0 0 0 4px rgba(5,150,105,0.25)'
                          : i === current ? '0 0 0 4px rgba(220,38,38,0.2)' : 'none',
                transition: 'all 0.4s',
                fontSize: '0.7rem', color: i <= current ? '#fff' : '#9ca3af', fontWeight: 700,
                flexShrink: 0,
              }}>{i <= current ? '✓' : i + 1}</div>
              <div style={{ fontSize: '0.67rem', fontWeight: i === current ? 700 : 500, color: getLabelColor(i), marginTop: 5, textAlign: 'center', maxWidth: 60, lineHeight: 1.3 }}>
                {step}
              </div>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div key={`line-${i}`} style={{ flex: 1, height: 3, background: getLineBg(i), borderRadius: 2, marginBottom: 20, minWidth: 16, transition: 'background 0.4s' }} />
            )}
          </>
        ))}
      </div>
    </div>
  )
}

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {
    if (!user?.id) return
    API.get(`/order/user/${user.id}`)
      .then(r => setOrders(r.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    // Poll every 30s so delivered orders auto-disappear after 5 mins
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [user])

  if (loading) return <Loader />

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 900, margin: '0 auto', padding: '88px clamp(16px,4vw,40px) 60px' }}>
      <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.3rem)', color: '#111827', marginBottom: 6 }}>My Orders</h1>
          <p style={{ color: '#6b7280' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
        <Link to="/customize"><button className="btn-primary" style={{ padding: '11px 24px', fontSize: '0.9rem' }}>+ New Pizza</button></Link>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '5rem', marginBottom: 20 }}>🍕</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: '#111827', marginBottom: 12 }}>No orders yet</h2>
          <p style={{ color: '#6b7280', marginBottom: 28 }}>Time to build your first custom pizza!</p>
          <Link to="/customize"><button className="btn-primary" style={{ padding: '13px 32px' }}>Build a Pizza →</button></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[...orders].reverse().map(order => {
            const isDelivered = order.orderStatus === 'Delivered'
            return (
            <div key={order._id} className="glass-card" style={{
              padding: '24px 28px',
              border: isDelivered ? '1.5px solid rgba(5,150,105,0.35)' : undefined,
              background: isDelivered ? 'linear-gradient(135deg,rgba(5,150,105,0.04),rgba(255,255,255,0.7))' : undefined,
              transition: 'all 0.5s',
            }}>
              {isDelivered && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.25)',
                  borderRadius: 10, padding: '8px 14px', marginBottom: 16,
                  color: '#059669', fontWeight: 700, fontSize: '0.88rem',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>✅</span>
                  Your pizza has been delivered! Enjoy 🍕 — This order will disappear shortly.
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: 4 }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge" style={{
                    background: `rgba(${STATUS_COLORS[order.orderStatus] === '#059669' ? '5,150,105' : STATUS_COLORS[order.orderStatus] === '#d97706' ? '217,119,6' : STATUS_COLORS[order.orderStatus] === '#7c3aed' ? '124,58,237' : '37,99,235'},0.1)`,
                    color: STATUS_COLORS[order.orderStatus] || '#2563eb',
                    border: `1px solid ${STATUS_COLORS[order.orderStatus] || '#2563eb'}40`,
                  }}>{order.orderStatus}</span>
                  <span className="badge badge-success">Paid</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {order.items && order.items.length > 0 ? (
                  order.items.map(item => (
                    <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.03)', padding: '4px 12px 4px 6px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)' }}>
                      {item.image ? (
                        <img src={item.image} style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'cover' }} alt="" />
                      ) : (
                        <span style={{ fontSize: '0.9rem' }}>🍕</span>
                      )}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{item.quantity}x {item.name}</span>
                    </div>
                  ))
                ) : (
                  <>
                    {order.pizzaBase && <span style={{ background: 'rgba(251,146,60,0.1)', color: '#ea580c', border: '1px solid rgba(251,146,60,0.2)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{order.pizzaBase}</span>}
                    {order.sauce && <span style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.15)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{order.sauce}</span>}
                    {order.cheese && <span style={{ background: 'rgba(234,179,8,0.1)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.2)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{order.cheese}</span>}
                    {(order.veggies || []).map(v => <span key={v} style={{ background: 'rgba(5,150,105,0.08)', color: '#059669', border: '1px solid rgba(5,150,105,0.15)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{v}</span>)}
                    {(order.meat || []).map(m => <span key={m} style={{ background: 'rgba(220,38,38,0.06)', color: '#b91c1c', border: '1px solid rgba(220,38,38,0.12)', padding: '3px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{m}</span>)}
                  </>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <StatusTracker status={order.orderStatus} />
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.3rem', background: isDelivered ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#dc2626,#e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginLeft: 16, flexShrink: 0 }}>
                  ₹{order.price}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
