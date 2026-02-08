import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiRefreshCw, FiCheck } from 'react-icons/fi';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FiTrendingUp size={28} style={{ color: '#10b981' }} /> Production Suggestion
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={loadSuggestion}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? 'rgba(139, 92, 246, 0.5)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            <FiRefreshCw size={18} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <div style={{ 
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white', 
            padding: '0.65rem 1.25rem', 
            borderRadius: '12px', 
            fontSize: '0.9rem', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}>
            <FiCheck size={18} />
            {suggestion.products?.length || 0} Products
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ 
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid rgba(167, 139, 250, 0.2)',
            borderTop: '4px solid #a78bfa',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#cbd5e1', marginTop: '1rem', fontSize: '1rem' }}>Calculating optimal production...</p>
        </div>
      ) : (
        <>
          <ul style={{ marginBottom: '2rem' }}>
            {suggestion.products && suggestion.products.length > 0 ? (
              suggestion.products.map((item, idx) => {
                const totalPrice = (parseFloat(item.product.price) * item.quantity).toFixed(2);
                const percentage = suggestion.totalValue > 0 ? ((totalPrice / suggestion.totalValue) * 100).toFixed(0) : 0;
                return (
                  <li key={idx} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        width: '50px',
                        height: '50px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: 'white'
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '1.15rem', color: '#f0fdf4' }}>{item.product.name}</strong>
                        <span style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                          Code: {item.product.code} • {item.quantity} units @ ${parseFloat(item.product.price).toFixed(2)}/unit
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: '150px' }}>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.2rem' }}>$ {totalPrice}</div>
                        <div style={{ color: '#a78bfa', fontSize: '0.85rem', marginTop: '0.25rem' }}>{percentage}% of total</div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#f3f4f6', fontSize: '1rem', fontWeight: 600 }}>⚠️ No production possible</p>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Increase raw material inventory to generate suggestions
                </p>
              </div>
            )}
          </ul>
          
          {suggestion.products && suggestion.products.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 100%)',
              border: '3px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(16, 185, 129, 0.1)'
            }}>
              <p style={{ fontSize: '0.95rem', color: '#d1d5db', margin: '0 0 0.75rem 0', fontWeight: 600 }}>💰 Total Production Value</p>
              <p style={{ 
                fontSize: '3rem', 
                fontWeight: 900, 
                color: '#10b981', 
                margin: 0, 
                textShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                letterSpacing: '-1px'
              }}>
                $ {parseFloat(suggestion.totalValue || 0).toFixed(2)}
              </p>
              <p style={{ color: '#6ee7b7', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                Greedy algorithm: maximizes value by prioritizing high-price products
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ProductionSuggestionPage;

