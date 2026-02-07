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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Raw Materials</h2>
        <span style={{ background: '#ee7752', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
          {rawMaterials.length}
        </span>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input name="code" value={form.code} onChange={handleChange} placeholder="Code" autoComplete="off" required />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" autoComplete="off" required />
        <input name="stockQuantity" value={form.stockQuantity} onChange={handleChange} placeholder="Stock Quantity" autoComplete="off" required type="number" />
        <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiPlus size={18} /> Add
        </button>
      </form>
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: '#8b5cf6' }} />
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
        {filteredMaterials.length > 0 ? filteredMaterials.map(rm => (
          <li key={rm.id}>
            <div>
              <strong>{rm.name} ({rm.code})</strong>
              <span>Stock: {rm.stockQuantity} units</span>
            </div>
            <div className="item-actions">
              <button className="btn-delete" onClick={() => handleDelete(rm.id, rm.name)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiTrash2 size={16} /> Delete
              </button>
            </div>
          </li>
        )) : (
          <p style={{ textAlign: 'center', color: '#d1d5db', marginTop: '2rem' }}>
            {searchTerm ? 'No raw materials found' : 'No raw materials registered'}
          </p>
        )}
      </ul>
    </section>
  );
}

export default RawMaterialPage;
