import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import apiClient, { withRetry } from '../utils/apiClient';
import { showSuccess, showError } from '../utils/toast';
import { validateAssociation } from '../utils/validation';

/**
 * Página de Associação Produto-Matéria-prima
 * Vincula produtos com suas matérias-primas necessárias
 */
function AssociationPage() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items);
  const rawMaterials = useSelector(state => state.rawMaterials.items);
  const associations = useSelector(state => state.associations.items);
  const [form, setForm] = useState({ productId: '', rawMaterialId: '', requiredQuantity: '' });
  const [stockWarning, setStockWarning] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    loadAssociations();
  }, [dispatch]);

  const loadAssociations = () => {
    withRetry(() => apiClient.get('/products-raw-materials'))
      .then(res => {
        dispatch({ type: 'SET_ASSOCIATIONS', payload: res.data });
      })
      .catch(error => {
        console.error('Error loading associations:', error);
      });
  };

  function handleChange(e) {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    setValidationErrors([]);
    
    // Check stock availability when quantity changes
    if (newForm.rawMaterialId && newForm.requiredQuantity) {
      const rawMaterial = rawMaterials.find(rm => rm.id === parseInt(newForm.rawMaterialId));
      const requiredQty = parseInt(newForm.requiredQuantity);
      if (rawMaterial && requiredQty > rawMaterial.stockQuantity) {
        setStockWarning(`Insufficient stock! Need ${requiredQty}, have only ${rawMaterial.stockQuantity}`);
      } else {
        setStockWarning('');
      }
    } else {
      setStockWarning('');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const product = products.find(p => p.id === parseInt(form.productId));
    const rawMaterial = rawMaterials.find(rm => rm.id === parseInt(form.rawMaterialId));
    const requiredQty = parseInt(form.requiredQuantity);
    const availableQty = rawMaterial?.stockQuantity || 0;
    
    // Validar
    const validation = validateAssociation(form);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      showError(validation.errors[0]);
      return;
    }
    
    // Validate stock before sending
    if (requiredQty > availableQty) {
      showError(`Insufficient stock! Need ${requiredQty}, have only ${availableQty}`);
      return;
    }
    
    withRetry(() => 
      apiClient.post('/products-raw-materials', {
        product: { id: form.productId },
        rawMaterial: { id: form.rawMaterialId },
        requiredQuantity: form.requiredQuantity
      })
    ).then(() => {
      loadAssociations();
      setForm({ productId: '', rawMaterialId: '', requiredQuantity: '' });
      setStockWarning('');
      setValidationErrors([]);
      showSuccess(`Associated "${product?.name}" with "${rawMaterial?.name}"!`);
    }).catch(error => {
      console.error('Error creating association:', error);
    });
  }

  function handleDelete(id, productName, materialName) {
    if (window.confirm(`Remove association between "${productName}" and "${materialName}"?`)) {
      withRetry(() => apiClient.delete(`/products-raw-materials/${id}`))
        .then(() => {
          loadAssociations();
          showSuccess('Association removed!');
        })
        .catch(error => {
          console.error('Error removing association:', error);
        });
    }
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          🔗 Product/Material Association
        </h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #ec4899, #be185d)',
          color: 'white', 
          padding: '0.65rem 1.25rem', 
          borderRadius: '12px', 
          fontSize: '0.9rem', 
          fontWeight: 700
        }}>
          {associations.length} links
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
        <div>
          <label htmlFor="assoc-product" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Product</label>
          <select id="assoc-product" name="productId" value={form.productId} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '6px', background: '#2d2d2d', color: '#f3f4f6', fontSize: '0.9rem' }}>
            <option value="">Select product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="assoc-material" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Material</label>
          <select id="assoc-material" name="rawMaterialId" value={form.rawMaterialId} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '6px', background: '#2d2d2d', color: '#f3f4f6', fontSize: '0.9rem' }}>
            <option value="">Select material...</option>
            {rawMaterials.map(rm => (
              <option key={rm.id} value={rm.id}>{rm.name} ({rm.code})</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="assoc-quantity" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Qty</label>
          <input id="assoc-quantity" name="requiredQuantity" value={form.requiredQuantity} onChange={handleChange} placeholder="0" autoComplete="off" required type="number" style={{ width: '100%', padding: '0.75rem', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '6px', background: '#2d2d2d', color: '#f3f4f6', fontSize: '0.9rem' }} />
        </div>
        <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: 'none', borderRadius: '6px', color: 'white', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.9rem', transition: 'all 0.3s ease' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
          <FiPlus size={20} /> Link
        </button>
      </form>
      {stockWarning && (
        <div style={{ 
          padding: '1rem 1.25rem', 
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.08))',
          border: '2px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '10px', 
          color: '#fca5a5', 
          fontSize: '0.95rem', 
          fontWeight: 700,
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
        }}>
          ⚠️ {stockWarning}
        </div>
      )}
      <ul>
        {associations.length > 0 ? associations.map((a, idx) => {
          const totalPrice = (parseFloat(a.product.price) * a.requiredQuantity).toFixed(2);
          return (
            <li key={a.id} style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ec4899, #be185d)',
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
                  <strong style={{ fontSize: '1.15rem', color: '#f0fdf4', display: 'block', marginBottom: '0.3rem' }}>
                    {a.product.name} <span style={{ color: '#fca5a5', fontSize: '0.85rem' }}>→</span> {a.rawMaterial.name}
                  </strong>
                  <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                    Qty: <strong>{a.requiredQuantity} units</strong> • Price/Unit: <strong>${parseFloat(a.product.price).toFixed(2)}</strong>
                  </span>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(190, 24, 93, 0.08) 100%)',
                  border: '2px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: '10px',
                  padding: '0.75rem 1.25rem',
                  minWidth: '140px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '0.8rem', color: '#f472b6', margin: '0 0 0.3rem 0', fontWeight: 600 }}>Total Cost</p>
                  <p style={{ fontSize: '1.35rem', color: '#ec4899', fontWeight: 900, margin: 0 }}>
                    $ {totalPrice}
                  </p>
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-delete" onClick={() => handleDelete(a.id, a.product.name, a.rawMaterial.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTrash2 size={18} /> Remove
                </button>
              </div>
            </li>
          );
        }) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: '#f3f4f6', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              📭 No associations registered
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              Create links between products and their required raw materials
            </p>
          </div>
        )}
      </ul>
    </section>
  );
}

export default AssociationPage;
