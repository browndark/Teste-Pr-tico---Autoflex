import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import apiClient, { withRetry } from '../utils/apiClient';
import { showError } from '../utils/toast';

/**
 * Página de Sugestão de Produção
 * Calcula quais produtos podem ser produzidos com estoque disponível
 * usando algoritmo greedy (ordena por maior valor primeiro)
 */
function ProductionSuggestionPage() {
  const [suggestion, setSuggestion] = useState({ products: [], totalValue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestion();
  }, []);

  const loadSuggestion = () => {
    setLoading(true);
    withRetry(() => apiClient.get('/production-suggestion'))
      .then(res => {
        setSuggestion(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching suggestion:', error);
        setLoading(false);
      });
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiTrendingUp size={24} /> Production Suggestion
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={loadSuggestion}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: '#6d28d9',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <FiRefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <span style={{ background: '#ee7752', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
            {suggestion.products?.length || 0}
          </span>
        </div>
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#d1d5db', marginTop: '2rem', fontSize: '1.1rem' }}>📊 Loading suggestion...</p>
      ) : (
        <>
          <ul>
            {suggestion.products && suggestion.products.length > 0 ? (
              suggestion.products.map((item, idx) => {
                const totalPrice = (parseFloat(item.product.price) * item.quantity).toFixed(2);
                return (
                  <li key={idx}>
                    <div>
                      <strong>{item.product.name}</strong>
                      <span>
                        Code: {item.product.code} • Suggested Quantity: {item.quantity} units • 
                        Unit Price: $ {parseFloat(item.product.price).toFixed(2)} • 
                        <span style={{ color: '#10b981', fontWeight: 600 }}> Total Price: $ {totalPrice}</span>
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: '#d1d5db', marginTop: '2rem', fontSize: '1rem' }}>
                ⚠️ No production can be suggested with current inventory
              </p>
            )}
          </ul>
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(109, 40, 217, 0.2) 100%)',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#f3f4f6', margin: '0 0 0.5rem 0' }}>💰 Total Production Value</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', margin: 0, textShadow: '0 2px 8px rgba(16, 185, 129, 0.4)' }}>
              $ {parseFloat(suggestion.totalValue || 0).toFixed(2)}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

export default ProductionSuggestionPage;
