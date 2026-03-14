import { useEffect, useState } from 'react'
import API from '../services/api'
import Loader from '../components/Loader'
import { useToast } from '../components/Toast'

const STATUSES = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered']

const STATUS_STYLE = {
  'Order Received': { bg: 'rgba(37,99,235,0.08)', color: '#2563eb', border: 'rgba(37,99,235,0.25)' },
  'In the Kitchen': { bg: 'rgba(217,119,6,0.08)', color: '#d97706', border: 'rgba(217,119,6,0.25)' },
  'Sent to Delivery': { bg: 'rgba(124,58,237,0.08)', color: '#7c3aed', border: 'rgba(124,58,237,0.25)' },
  'Delivered': { bg: 'rgba(5,150,105,0.1)', color: '#059669', border: 'rgba(5,150,105,0.3)' },
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [updating, setUpdating] = useState({})
  const { addToast } = useToast()

  const fetchOrders = () => {
    setLoading(true)
    API.get('/order/')
      .then(r => setOrders(r.data || []))
      .catch(() => addToast('Failed to load orders', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  async function updateStatus(orderId, newStatus) {
    setUpdating(u => ({ ...u, [orderId]: true }))
    try {
      await API.put(`/order/status/${orderId}`, { status: newStatus })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      addToast(`Status → ${newStatus}`, 'success')
    } catch (err) {
      console.error('Update error:', err)
      addToast(err.response?.data?.message || 'Failed to update status', 'error')
      // Revert local state on failure by re-fetching
      fetchOrders()
    } finally {
      setUpdating(u => ({ ...u, [orderId]: false }))
    }
  }

  if (loading) return <Loader />

  const filtered = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter)

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 1280, margin: '0 auto', padding: '88px clamp(16px,4vw,40px) 60px' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#111827', marginBottom: 6 }}>Order Management</h1>
          <p style={{ color: '#6b7280' }}>{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders} style={{ padding: '9px 20px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {['All', ...STATUSES].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '8px 18px', borderRadius: 50, fontWeight: 600, fontSize: '0.83rem',
            cursor: 'pointer', transition: 'all 0.25s',
            background: filter === f ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'rgba(255,255,255,0.72)',
            color: filter === f ? '#fff' : '#374151',
            border: filter === f ? 'none' : '1px solid rgba(0,0,0,0.1)',
            boxShadow: filter === f ? '0 4px 14px rgba(220,38,38,0.3)' : '0 2px 6px rgba(0,0,0,0.05)',
          }}>{f} {f === 'All' ? `(${orders.length})` : `(${orders.filter(o => o.orderStatus === f).length})`}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📛</div>
          <p style={{ color: '#6b7280' }}>No orders in this category</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[...filtered].reverse().map(order => {
            const st = STATUS_STYLE[order.orderStatus] || STATUS_STYLE['Order Received']
            return (
              <div key={order._id} className="glass-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center' }}>
                  {/* User info */}
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', marginBottom: 3 }}>{order.userId?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{order.userId?.email || ''}</div>
                    <div style={{ fontSize: '0.75rem', color: '#b0b7c3', marginTop: 2 }}>#{order._id.slice(-8).toUpperCase()}</div>
                  </div>

                  {/* Order items / ingredients */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {order.items && order.items.length > 0
                      ? order.items.map((item, i) => (
                          <span key={i} style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', padding: '2px 9px', borderRadius: 50, fontSize: '0.73rem', color: '#dc2626', fontWeight: 500 }}>
                            {item.quantity}× {item.name}
                          </span>
                        ))
                      : [order.pizzaBase, order.sauce, order.cheese, ...(order.veggies || []), ...(order.meat || [])].filter(Boolean).map((item, i) => (
                          <span key={i} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', padding: '2px 9px', borderRadius: 50, fontSize: '0.73rem', color: '#374151', fontWeight: 500 }}>{item}</span>
                        ))
                    }
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 180 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg,#dc2626,#e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{order.price}</span>
                      <span className={order.paymentStatus === 'Paid' ? 'badge badge-success' : 'badge badge-success'} style={{ fontSize: '0.72rem' }}>Paid</span>
                    </div>
                    <select
                      value={order.orderStatus}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      disabled={updating[order._id]}
                      style={{
                        width: '100%', padding: '8px 12px', borderRadius: 10, fontSize: '0.83rem',
                        fontWeight: 600, background: st.bg, color: st.color,
                        border: `1px solid ${st.border}`, cursor: 'pointer',
                      }}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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
