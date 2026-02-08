import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import apiClient, { withRetry } from '../utils/apiClient';
import { showSuccess, showError } from '../utils/toast';
import { validateProduct } from '../utils/validation';

/**
 * Página de Produtos
 * CRUD completo para gerenciar produtos da indústria
 */
function ProductPage() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const [form, setForm] = useState({ code: '', name: '', price: '', quantity: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    loadProducts();
  }, [dispatch]);

  const loadProducts = () => {
    withRetry(() => apiClient.get('/products'))
      .then(res => {
        dispatch({ type: 'SET_PRODUCTS', payload: res.data });
      })
      .catch(error => {
        console.error('Error loading products:', error);
      });
  };

  function handleChange(e) {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    setValidationErrors([]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validar antes de enviar
    const validation = validateProduct({
      code: form.code,
      name: form.name,
      price: form.price,
    });
    
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      showError(validation.errors[0]);
      return;
    }

    withRetry(() => 
      apiClient.post('/products', {
        code: form.code.toUpperCase(),
        name: form.name,
        price: parseFloat(form.price),
        quantity: form.quantity ? parseInt(form.quantity) : 1
      })
    ).then(() => {
      loadProducts();
      setForm({ code: '', name: '', price: '', quantity: '' });
      setValidationErrors([]);
      showSuccess(`Product "${form.name}" added successfully!`);
    }).catch(error => {
      console.error('Error adding product:', error);
    });
  }

  function handleDelete(id, name) {
    if (window.confirm(`Delete "${name}"?`)) {
      withRetry(() => apiClient.delete(`/products/${id}`))
        .then(() => {
          loadProducts();
          showSuccess(`Product "${name}" deleted!`);
        })
        .catch(error => {
          console.error('Error deleting product:', error);
        });
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          📦 Products
        </h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white', 
          padding: '0.65rem 1.25rem', 
          borderRadius: '12px', 
          fontSize: '0.9rem', 
          fontWeight: 700
        }}>
          {products.length} items
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Code</label>
          <input name="code" value={form.code} onChange={handleChange} placeholder="e.g., PRD001" autoComplete="off" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" autoComplete="off" required />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Unit Price ($)</label>
          <input name="price" value={form.price} onChange={handleChange} placeholder="0.00" autoComplete="off" required type="number" step="0.01" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Qty</label>
          <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="0" autoComplete="off" type="number" />
        </div>
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <FiPlus size={20} /> Add Product
        </button>
      </form>
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa', size: 20 }} />
        <input
          id="searchProducts"
          name="searchProducts"
          type="text"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 2.75rem',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.05)',
            color: '#d1d5db',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)';
            e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
          }}
        />
      </div>
      <ul>
        {filteredProducts.length > 0 ? filteredProducts.map((p, idx) => {
          const totalPrice = (parseFloat(p.price) * (p.quantity || 1)).toFixed(2);
          return (
            <li key={p.id} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'white',
                  flexShrink: 0
                }}>
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.15rem', color: '#f0fdf4', display: 'block', marginBottom: '0.3rem' }}>{p.name}</strong>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Code: <strong>{p.code}</strong> • Unit: <strong>${parseFloat(p.price).toFixed(2)}</strong> {p.quantity && `• Qty: ${p.quantity} units`}</span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.08) 100%)',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  padding: '0.75rem 1.25rem',
                  minWidth: '140px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#93c5fd', margin: '0 0 0.3rem 0', fontWeight: 600 }}>Total</p>
                  <p style={{ fontSize: '1.35rem', color: '#3b82f6', fontWeight: 900, margin: 0 }}>
                    $ {totalPrice}
                  </p>
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-delete" onClick={() => handleDelete(p.id, p.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTrash2 size={18} /> Delete
                </button>
              </div>
            </li>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: '#f3f4f6', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              {searchTerm ? '🔍 No products found' : '📭 No products registered'}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Click "Add Product" to create your first product'}
            </p>
          </div>
        )}
      </ul>
    </section>
  );
}

export default ProductPage;
