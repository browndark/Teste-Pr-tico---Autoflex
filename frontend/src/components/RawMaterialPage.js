import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import apiClient, { withRetry } from '../utils/apiClient';
import { showSuccess, showError } from '../utils/toast';
import { validateRawMaterial } from '../utils/validation';

/**
 * Página de Matérias-primas
 * CRUD completo para gerenciar insumos/matérias-primas
 */
function RawMaterialPage() {
  const dispatch = useDispatch();
  const rawMaterials = useSelector(state => state.rawMaterials.items);
  const [form, setForm] = useState({ code: '', name: '', stockQuantity: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    loadRawMaterials();
  }, [dispatch]);

  const loadRawMaterials = () => {
    withRetry(() => apiClient.get('/raw-materials'))
      .then(res => {
        dispatch({ type: 'SET_RAW_MATERIALS', payload: res.data });
      })
      .catch(error => {
        console.error('Error loading raw materials:', error);
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
    const validation = validateRawMaterial({
      code: form.code,
      name: form.name,
      stockQuantity: form.stockQuantity,
    });
    
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      showError(validation.errors[0]);
      return;
    }

    withRetry(() => 
      apiClient.post('/raw-materials', {
        code: form.code.toUpperCase(),
        name: form.name,
        stockQuantity: parseInt(form.stockQuantity)
      })
    ).then(() => {
      loadRawMaterials();
      setForm({ code: '', name: '', stockQuantity: '' });
      setValidationErrors([]);
      showSuccess(`Raw material "${form.name}" added successfully!`);
    }).catch(error => {
      console.error('Error adding raw material:', error);
    });
  }

  function handleDelete(id, name) {
    if (window.confirm(`Delete "${name}"?`)) {
      withRetry(() => apiClient.delete(`/raw-materials/${id}`))
        .then(() => {
          loadRawMaterials();
          showSuccess(`Raw material "${name}" deleted!`);
        })
        .catch(error => {
          console.error('Error deleting raw material:', error);
        });
    }
  }

  const filteredMaterials = rawMaterials.filter(rm =>
    rm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rm.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          ⚙️ Raw Materials
        </h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
          color: 'white', 
          padding: '0.65rem 1.25rem', 
          borderRadius: '12px', 
          fontSize: '0.9rem', 
          fontWeight: 700
        }}>
          {rawMaterials.length} items
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
        <div>
          <label htmlFor="material-code" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Code</label>
          <input id="material-code" name="code" value={form.code} onChange={handleChange} placeholder="e.g., RAW001" autoComplete="off" required />
        </div>
        <div>
          <label htmlFor="material-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Name</label>
          <input id="material-name" name="name" value={form.name} onChange={handleChange} placeholder="Material name" autoComplete="off" required />
        </div>
        <div>
          <label htmlFor="material-stock" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Stock Qty</label>
          <input id="material-stock" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} placeholder="0" autoComplete="off" required type="number" />
        </div>
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
          <FiPlus size={20} /> Add
        </button>
      </form>
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a78bfa', size: 20 }} />
        <input
          id="searchMaterials"
          name="searchMaterials"
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
        {filteredMaterials.length > 0 ? filteredMaterials.map((rm, idx) => (
          <li key={rm.id} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
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
                <strong style={{ fontSize: '1.15rem', color: '#f0fdf4', display: 'block', marginBottom: '0.3rem' }}>{rm.name}</strong>
                <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Code: <strong>{rm.code}</strong></span>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.08) 100%)',
                border: '2px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '10px',
                padding: '0.75rem 1.25rem',
                minWidth: '140px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.8rem', color: '#67e8f9', margin: '0 0 0.3rem 0', fontWeight: 600 }}>Stock</p>
                <p style={{ fontSize: '1.35rem', color: '#06b6d4', fontWeight: 900, margin: 0 }}>
                  {rm.stockQuantity}
                </p>
              </div>
            </div>
            <div className="item-actions">
              <button className="btn-delete" onClick={() => handleDelete(rm.id, rm.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiTrash2 size={18} /> Delete
              </button>
            </div>
          </li>
        )) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: '#f3f4f6', fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
              {searchTerm ? '🔍 No materials found' : '📭 No materials registered'}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Click "Add" to create your first raw material'}
            </p>
          </div>
        )}
      </ul>
    </section>
  );
}

export default RawMaterialPage;
