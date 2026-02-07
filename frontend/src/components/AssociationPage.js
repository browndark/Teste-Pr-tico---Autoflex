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
        setStockWarning(`⚠️ Insufficient stock! Need ${requiredQty}, have only ${rawMaterial.stockQuantity}`);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Product/Raw Material Association</h2>
        <span style={{ background: '#ee7752', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
          {associations.length}
        </span>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <select name="productId" value={form.productId} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="rawMaterialId" value={form.rawMaterialId} onChange={handleChange} required>
          <option value="">Select Raw Material</option>
          {rawMaterials.map(rm => (
            <option key={rm.id} value={rm.id}>{rm.name}</option>
          ))}
        </select>
        <input name="requiredQuantity" value={form.requiredQuantity} onChange={handleChange} placeholder="Required Quantity" autoComplete="off" required type="number" />
        {stockWarning && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '6px', color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            {stockWarning}
          </div>
        )}
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus size={18} /> Associate
        </button>
      </form>
      <ul>
        {associations.length > 0 ? associations.map(a => {
          const totalPrice = (parseFloat(a.product.price) * a.requiredQuantity).toFixed(2);
          return (
            <li key={a.id}>
              <div>
                <strong>{a.product.name}</strong>
                <span>Raw Material: {a.rawMaterial.name} • Quantity: {a.requiredQuantity} units • Unit Price: $ {parseFloat(a.product.price).toFixed(2)}</span>
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 150, 100, 0.1) 100%)', borderRadius: '4px', color: '#10b981', fontWeight: 700, fontSize: '1rem', borderLeft: '3px solid #10b981' }}>
                  Total Price: $ {totalPrice}
                </div>
              </div>
              <div className="item-actions">
                <button className="btn-delete" onClick={() => handleDelete(a.id, a.product.name, a.rawMaterial.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
            </li>
          );
        }) : (
          <p style={{ textAlign: 'center', color: '#d1d5db', marginTop: '2rem' }}>No associations registered</p>
        )}
      </ul>
    </section>
  );
}

export default AssociationPage;
