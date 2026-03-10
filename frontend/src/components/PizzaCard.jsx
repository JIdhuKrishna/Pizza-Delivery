import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function PizzaCard({ pizza }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleBuyNow = () => {
    addToCart(pizza)
    navigate('/checkout')
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(255,255,255,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(220,38,38,0.14), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
    >
      <div style={{
        height: 160,
        background: 'linear-gradient(135deg,rgba(220,38,38,0.07),rgba(251,146,60,0.07))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {pizza.image ? (
          <img 
            src={pizza.image} 
            alt={pizza.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <span style={{ fontSize: '3.2rem' }}>🍕</span>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <button 
            onClick={() => navigate('/customize', { state: { pizza } })}
            style={{ 
              background: 'rgba(255,255,255,0.9)', 
              border: 'none', 
              borderRadius: '50%', 
              width: 36, 
              height: 36, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              fontSize: '1.1rem'
            }}
            title="Customize"
          >
            ⚙️
          </button>
        </div>
      </div>

      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.05rem',
          color: '#111827', marginBottom: 10,
        }}>{pizza.name}</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
          {pizza.base && (
            <span style={{ background: 'rgba(251,146,60,0.1)', color: '#ea580c', border: '1px solid rgba(251,146,60,0.25)', padding: '2px 10px', borderRadius: 50, fontSize: '0.73rem', fontWeight: 500 }}>
              {pizza.base}
            </span>
          )}
          {pizza.sauce && (
            <span style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.2)', padding: '2px 10px', borderRadius: 50, fontSize: '0.73rem', fontWeight: 500 }}>
              {pizza.sauce}
            </span>
          )}
          {pizza.cheese && (
            <span style={{ background: 'rgba(234,179,8,0.1)', color: '#ca8a04', border: '1px solid rgba(234,179,8,0.2)', padding: '2px 10px', borderRadius: 50, fontSize: '0.73rem', fontWeight: 500 }}>
              {pizza.cheese}
            </span>
          )}
        </div>

        {pizza.veggies?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {pizza.veggies.map(v => (
              <span key={v} style={{ background: 'rgba(5,150,105,0.08)', color: '#059669', border: '1px solid rgba(5,150,105,0.2)', padding: '2px 8px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 500 }}>
                🥦 {v}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              fontWeight: 800, fontSize: '1.25rem',
              background: 'linear-gradient(135deg,#dc2626,#e11d48)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>₹{pizza.price}</span>
            <button
              className="btn-glass"
              style={{ padding: '8px 12px', fontSize: '0.8rem', minHeight: 'unset' }}
              onClick={() => addToCart(pizza)}
            >
              🛒 +
            </button>
          </div>
          
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
