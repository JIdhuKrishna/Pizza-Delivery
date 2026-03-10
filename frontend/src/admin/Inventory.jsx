import { useEffect, useState } from 'react'
import API from '../services/api'
import Loader from '../components/Loader'
import { useToast } from '../components/Toast'

const CAT_COLORS = {
  base:   { bg: 'rgba(251,146,60,0.1)', color: '#ea580c', border: 'rgba(251,146,60,0.25)' },
  sauce:  { bg: 'rgba(220,38,38,0.08)', color: '#dc2626', border: 'rgba(220,38,38,0.2)' },
  cheese: { bg: 'rgba(234,179,8,0.1)',  color: '#ca8a04', border: 'rgba(234,179,8,0.2)' },
  veggies:{ bg: 'rgba(5,150,105,0.08)', color: '#059669', border: 'rgba(5,150,105,0.2)' },
  meat:   { bg: 'rgba(225,29,72,0.08)', color: '#e11d48', border: 'rgba(225,29,72,0.2)' },
}

const EMPTY_FORM = { itemName: '', category: 'base', quantity: '', threshold: '10', price: '' }

export default function Inventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchInventory()
  }, [])

  function fetchInventory() {
    API.get('/admin/inventory/')
      .then(r => setItems(r.data || []))
      .catch(() => addToast('Failed to load inventory', 'error'))
      .finally(() => setLoading(false))
  }

  function setF(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  function startEdit(item) {
    setEditId(item._id)
    setForm({ itemName: item.itemName, category: item.category, quantity: String(item.quantity), threshold: String(item.threshold), price: String(item.price) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() { setEditId(null); setForm(EMPTY_FORM) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.itemName || !form.quantity || !form.price) { addToast('Fill all required fields', 'warning'); return }
    setSaving(true)
    const payload = { itemName: form.itemName, category: form.category, quantity: Number(form.quantity), threshold: Number(form.threshold), price: Number(form.price) }
    try {
      if (editId) {
        await API.put(`/admin/inventory/${editId}`, payload)
        setItems(prev => prev.map(i => i._id === editId ? { ...i, ...payload } : i))
        addToast('Item updated!', 'success')
        setEditId(null)
      } else {
        const res = await API.post('/admin/inventory/', payload)
        setItems(prev => [...prev, res.data.item || res.data])
        addToast('Item added!', 'success')
      }
      setForm(EMPTY_FORM)
    } catch (err) {
      addToast(err.response?.data?.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/admin/inventory/${id}`)
      setItems(prev => prev.filter(i => i._id !== id))
      addToast('Item deleted', 'success')
      setDeleteModal(null)
    } catch {
      addToast('Delete failed', 'error')
    }
  }

  if (loading) return <Loader />

  const labelStyle = { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.83rem', color: '#374151' }
  const inputStyle = { fontSize: '0.9rem' }

  return (
    <div className="page-enter" style={{ paddingTop: 88, paddingBottom: 60, maxWidth: 1280, margin: '0 auto', padding: '88px clamp(16px,4vw,40px) 60px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.2rem)', color: '#111827', marginBottom: 6 }}>Inventory Management</h1>
        <p style={{ color: '#6b7280' }}>{items.length} ingredients tracked</p>
      </div>

      {/* Add/Edit Form */}
      <div className="glass-card" style={{ padding: '28px 30px', marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#111827', marginBottom: 20 }}>
          {editId ? '\u270f\ufe0f Edit Item' : '\u002b Add Ingredient'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Item Name *</label>
              <input style={inputStyle} placeholder="e.g. Mozzarella" value={form.itemName} onChange={e => setF('itemName', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={e => setF('category', e.target.value)}>
                {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quantity *</label>
              <input style={inputStyle} type="number" min="0" placeholder="e.g. 50" value={form.quantity} onChange={e => setF('quantity', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Low Stock Alert At</label>
              <input style={inputStyle} type="number" min="0" placeholder="10" value={form.threshold} onChange={e => setF('threshold', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input style={inputStyle} type="number" min="0" step="0.01" placeholder="e.g. 49" value={form.price} onChange={e => setF('price', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn-primary" style={{ padding: '11px 28px' }} disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}
            </button>
            {editId && <button type="button" className="btn-outline" style={{ padding: '11px 22px' }} onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* Table */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🥡</div>
          <p style={{ color: '#6b7280' }}>No ingredients yet. Add your first one above!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => {
            const cat = CAT_COLORS[item.category] || CAT_COLORS.base
            const isLow = item.quantity <= item.threshold && item.quantity > 0
            const isOut = item.quantity === 0
            return (
              <div key={item._id} className="glass-card" style={{ padding: '18px 22px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto auto auto', gap: 16, alignItems: 'center' }}>
                {/* Category badge */}
                <span style={{ ...cat, padding: '3px 11px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.category}</span>

                {/* Name */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.93rem', color: '#111827' }}>{item.itemName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>₹{item.price} / unit</div>
                </div>

                {/* Qty */}
                <div style={{ textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: isOut ? '#dc2626' : isLow ? '#d97706' : '#059669' }}>{item.quantity}</div>
                  <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>qty / {item.threshold}</div>
                </div>

                {/* Stock badge */}
                <span style={{
                  padding: '4px 12px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 600,
                  background: isOut ? 'rgba(220,38,38,0.1)' : isLow ? 'rgba(217,119,6,0.1)' : 'rgba(5,150,105,0.1)',
                  color: isOut ? '#dc2626' : isLow ? '#d97706' : '#059669',
                  border: `1px solid ${isOut ? 'rgba(220,38,38,0.25)' : isLow ? 'rgba(217,119,6,0.25)' : 'rgba(5,150,105,0.25)'}`,
                  animation: isOut ? 'pulseRed 2s infinite' : 'none',
                  whiteSpace: 'nowrap',
                }}>{isOut ? '🚨 Out of Stock' : isLow ? '⚠️ Low Stock' : '✓ In Stock'}</span>

                {/* Actions */}
                <button className="btn-icon" title="Edit" onClick={() => startEdit(item)}>✏️</button>
                <button className="btn-danger" title="Delete" onClick={() => setDeleteModal(item)}>🗑️</button>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div className="glass-card" style={{ maxWidth: 400, width: '100%', padding: '36px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🗑️</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#111827', marginBottom: 10 }}>Delete Item?</h2>
            <p style={{ color: '#6b7280', marginBottom: 28 }}>Are you sure you want to delete <strong style={{ color: '#111827' }}>{deleteModal.itemName}</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn-outline" style={{ padding: '11px 26px' }} onClick={() => setDeleteModal(null)}>Cancel</button>
              <button className="btn-danger" style={{ padding: '11px 26px', borderRadius: 50, fontWeight: 700 }} onClick={() => handleDelete(deleteModal._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
