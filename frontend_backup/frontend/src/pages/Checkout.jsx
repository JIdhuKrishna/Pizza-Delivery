import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import API from '../services/api'

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()
  const [paying, setPaying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  const order = location.state

  useEffect(() => {
    if (!order || !order.pizzaBase) navigate('/customize', { replace: true })
  }, [order, navigate])

  if (!order || !order.pizzaBase) return null

  const { pizzaBase, sauce, cheese, veggies = [], meat = [], price } = order

  const ingredients = [
    { label: 'Base', value: pizzaBase },
    { label: 'Sauce', value: sauce },
    { label: 'Cheese', value: cheese },
    ...(veggies.length ? [{ label: 'Veggies', value: veggies.join(', ') }] : []),
    ...(meat.length ? [{ label: 'Meat', value: meat.join(', ') }] : []),
  ]

  async function handlePay() {
    setPaying(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) { addToast('Failed to load payment gateway', 'error'); setPaying(false); return }

      const { data } = await API.post('/payment/create-order', { amount: price })
      const rzpOrder = data.order

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SPZS4l9ynnPjPD',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        order_id: rzpOrder.id,
        name: 'PizzaCraft',
        description: 'Custom Pizza Order',
        theme: { color: '#dc2626' },
        handler: async (response) => {
          try {
            await API.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            const placed = await API.post('/order/place', { pizzaBase, sauce, cheese, veggies, meat, price })
            setOrderId(placed.data?.order?._id || placed.data?._id || 'N/A')
            setSuccess(true)
            addToast('🍕 Order placed successfully!', 'success')
          } catch {
            addToast('Payment verified but order placement failed. Contact support.', 'error')
          }
          setPaying(false)
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => { addToast('Payment failed. Please try again.', 'error'); setPaying(false) })
      rzp.open()
    } catch (err) {
      addToast(err.response?.data?.message || 'Could not initiate payment', 'error')
      setPaying(false)
    }
  }

  if (success) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
        <div className="glass-card" style={{ maxWidth: 480, width: '100%', padding: '52px 40px', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,rgba(5,150,105,0.15),rgba(5,150,105,0.08))',
            border: '2px solid rgba(5,150,105,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '2.2rem',
          }}>&#x2713;</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#111827', marginBottom: 12 }}>Order Placed! 🎉</h2>
          <p style={{ color: '#6b7280', marginBottom: 8 }}>Your pizza is being prepared.</p>
          {orderId !== 'N/A' && <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: 28 }}>Order ID: <strong style={{ color: '#374151' }}>{orderId}</strong></p>}
          <button className="btn-primary" style={{ padding: '13px 32px', marginRight: 12 }} onClick={() => navigate('/orders')}>Track My Order →</button>
          <button className="btn-outline" style={{ padding: '13px 28px', marginTop: 10 }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 760, margin: '0 auto', padding: '88px clamp(16px,4vw,40px) 60px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: '#111827', marginBottom: 8 }}>Checkout</h1>
        <p style={{ color: '#6b7280' }}>Review your order and complete payment</p>
      </div>

      {/* Order Summary */}
      <div className="glass-card" style={{ padding: '28px 30px', marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 20 }}>Order Summary</h2>
        {ingredients.map(ing => (
          <div key={ing.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#6b7280', fontWeight: 500, fontSize: '0.9rem' }}>{ing.label}</span>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>{ing.value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, marginTop: 4 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Total</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg,#dc2626,#e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{price}</span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="glass-card" style={{ padding: '22px 28px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>📦</div>
          <div>
            <div style={{ fontWeight: 600, color: '#111827', marginBottom: 3 }}>Delivery to your address</div>
            <div style={{ color: '#6b7280', fontSize: '0.88rem' }}>Estimated time: 30–45 minutes</div>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="glass-card" style={{ padding: '28px 30px' }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: 6 }}>Payment</h2>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: 22 }}>Secured by Razorpay — UPI, cards, wallets accepted</p>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1.02rem' }} onClick={handlePay} disabled={paying}>
          {paying ? 'Processing...' : `Pay ₹${price} via Razorpay`}
        </button>
        <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 12, fontSize: '0.9rem' }} onClick={() => navigate('/customize')}>
          ← Back to Builder
        </button>
      </div>
    </div>
  )
}
