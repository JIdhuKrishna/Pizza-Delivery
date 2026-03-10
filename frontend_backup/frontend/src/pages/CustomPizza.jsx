import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../services/api'
import Loader from '../components/Loader'
import { useToast } from '../components/Toast'

function OptionPill({ item, selected, multi, onToggle }) {
  const active = multi ? selected.includes(item.itemName) : selected === item.itemName
  return (
    <button
      type="button"
      onClick={() => onToggle(item.itemName)}
      style={{
        padding: '9px 16px', borderRadius: 50, fontWeight: 600, fontSize: '0.85rem',
        cursor: 'pointer', transition: 'all 0.25s',
        background: active ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'rgba(255,255,255,0.7)',
        color: active ? '#fff' : '#374151',
        border: active ? 'none' : '1.5px solid rgba(0,0,0,0.1)',
        boxShadow: active ? '0 4px 14px rgba(220,38,38,0.3)' : '0 2px 6px rgba(0,0,0,0.04)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}
    >
      {item.itemName}
      {item.price ? <span style={{ opacity: active ? 0.85 : 0.6, fontSize: '0.78rem' }}>₹{item.price}</span> : null}
    </button>
  )
}

export default function CustomPizza() {
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [base, setBase] = useState('')
  const [sauce, setSauce] = useState('')
  const [cheese, setCheese] = useState('')
  const [veggies, setVeggies] = useState([])
  const [meat, setMeat] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()

  useEffect(() => {
    API.get('/pizza/options')
      .then(r => {
        setOptions(r.data)
        // Pre-fill from PizzaCard navigate state
        if (location.state?.pizza) {
          const p = location.state.pizza
          if (p.base) setBase(p.base)
          if (p.sauce) setSauce(p.sauce)
          if (p.cheese) setCheese(p.cheese)
          if (p.veggies?.length) setVeggies(p.veggies)
        }
      })
      .catch(() => addToast('Failed to load pizza options', 'error'))
      .finally(() => setLoading(false))
  }, [location.state])

  const price = useMemo(() => {
    if (!options) return 0
    let total = 0
    const find = (arr, name) => arr?.find(i => i.itemName === name)?.price || 0
    total += find(options.bases, base)
    total += find(options.sauces, sauce)
    total += find(options.cheese, cheese)
    veggies.forEach(v => { total += find(options.veggies, v) })
    meat.forEach(m => { total += find(options.meat, m) })
    return total
  }, [options, base, sauce, cheese, veggies, meat])

  function toggleMulti(val, list, setList) {
    setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }

  function handleContinue() {
    if (!base || !sauce || !cheese) {
      setError('Please select a base, sauce, and cheese to continue.')
      return
    }
    setError('')
    navigate('/checkout', { state: { pizzaBase: base, sauce, cheese, veggies, meat, price } })
  }

  if (loading) return <Loader />

  const Section = ({ title, icon, children }) => (
    <div className="glass-card" style={{ padding: '24px 26px', marginBottom: 20 }}>
      <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span> {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>{children}</div>
    </div>
  )

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 1280, margin: '0 auto', padding: '88px clamp(16px,4vw,40px) 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.4rem)', color: '#111827', marginBottom: 8 }}>🍕 Build Your Pizza</h1>
        <p style={{ color: '#6b7280' }}>Choose your ingredients below — watch the price update live</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 28, alignItems: 'start' }}>
        {/* Left: Builder */}
        <div>
          <Section title="Choose Your Base" icon="🫓">
            {(options?.bases || []).map(item => <OptionPill key={item._id} item={item} selected={base} multi={false} onToggle={v => setBase(v)} />)}
            {!options?.bases?.length && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No bases in inventory yet.</p>}
          </Section>
          <Section title="Choose Your Sauce" icon="🍅">
            {(options?.sauces || []).map(item => <OptionPill key={item._id} item={item} selected={sauce} multi={false} onToggle={v => setSauce(v)} />)}
            {!options?.sauces?.length && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No sauces in inventory yet.</p>}
          </Section>
          <Section title="Choose Your Cheese" icon="🧀">
            {(options?.cheese || []).map(item => <OptionPill key={item._id} item={item} selected={cheese} multi={false} onToggle={v => setCheese(v)} />)}
            {!options?.cheese?.length && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No cheese in inventory yet.</p>}
          </Section>
          <Section title="Add Veggies" icon="🥗">
            {(options?.veggies || []).map(item => <OptionPill key={item._id} item={item} selected={veggies} multi={true} onToggle={v => toggleMulti(v, veggies, setVeggies)} />)}
            {!options?.veggies?.length && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No veggies in inventory yet.</p>}
          </Section>
          <Section title="Add Meat Toppings" icon="🥩">
            {(options?.meat || []).map(item => <OptionPill key={item._id} item={item} selected={meat} multi={true} onToggle={v => toggleMulti(v, meat, setMeat)} />)}
            {!options?.meat?.length && <p style={{ color: '#9ca3af', fontSize: '0.88rem' }}>No meat in inventory yet.</p>}
          </Section>
        </div>

        {/* Right: Live Preview */}
        <div style={{ position: 'sticky', top: 88 }}>
          <div className="glass-card" style={{ padding: '28px 26px' }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              🍕 Your Pizza
            </h3>

            {[{ label: 'Base', value: base }, { label: 'Sauce', value: sauce }, { label: 'Cheese', value: cheese }].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#6b7280', fontSize: '0.88rem', fontWeight: 500 }}>{row.label}</span>
                {row.value
                  ? <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#111827' }}>{row.value}</span>
                  : <span style={{ color: '#d1d5db', fontSize: '0.82rem' }}>Not selected</span>}
              </div>
            ))}

            {veggies.length > 0 && (
              <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#6b7280', fontSize: '0.88rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Veggies</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {veggies.map(v => <span key={v} style={{ background: 'rgba(5,150,105,0.1)', color: '#059669', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{v}</span>)}
                </div>
              </div>
            )}
            {meat.length > 0 && (
              <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: '#6b7280', fontSize: '0.88rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Meat</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {meat.map(m => <span key={m} style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626', padding: '2px 10px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 500 }}>{m}</span>)}
                </div>
              </div>
            )}

            {price === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#d1d5db', fontSize: '0.9rem' }}>Select ingredients to see price</div>
            ) : (
              <div style={{ padding: '16px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#374151' }}>Total</span>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.6rem', background: 'linear-gradient(135deg,#dc2626,#e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>₹{price}</span>
              </div>
            )}

            {error && <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>{error}</div>}

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.97rem', marginTop: 8 }} onClick={handleContinue}>
              Proceed to Checkout →
            </button>
            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.88rem', marginTop: 10 }} onClick={() => { setBase(''); setSauce(''); setCheese(''); setVeggies([]); setMeat([]) }}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
