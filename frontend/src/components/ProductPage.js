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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <span style={{ background: '#ee7752', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
          {products.length}
        </span>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input name="code" value={form.code} onChange={handleChange} placeholder="Code" autoComplete="off" required />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" autoComplete="off" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" autoComplete="off" required type="number" step="0.01" />
        <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" autoComplete="off" type="number" />
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus size={18} /> Add
        </button>
      </form>
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#8b5cf6' }} />
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
            padding: '0.75rem 0.75rem 0.75rem 2.5rem',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '6px',
            background: 'rgba(139, 92, 246, 0.05)',
            color: '#d1d5db',
            fontSize: '0.95rem'
          }}
        />
      </div>
      <ul>
        {filteredProducts.length > 0 ? filteredProducts.map(p => {
          const totalPrice = (parseFloat(p.price) * (p.quantity || 1)).toFixed(2);
          return (
            <li key={p.id}>
              <div>
                <strong>{p.name} ({p.code})</strong>
                <span>Unit Price: $ {parseFloat(p.price).toFixed(2)}{p.quantity && ` • Quantity: ${p.quantity}`}</span>
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 150, 100, 0.1) 100%)', borderRadius: '4px', color: '#10b981', fontWeight: 700, fontSize: '1rem', borderLeft: '3px solid #10b981' }}>
                  Total Price: $ {totalPrice}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-delete" onClick={() => handleDelete(p.id, p.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
            </li>
          );
        }) : (
          <p style={{ textAlign: 'center', color: '#d1d5db', marginTop: '2rem' }}>
            {searchTerm ? 'No products found' : 'No products registered'}
          </p>
        )}
      </ul>
    </section>
  );
}

export default ProductPage;
