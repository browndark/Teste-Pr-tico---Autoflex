
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './components/LoginPage';
import ProductPage from './components/ProductPage';
import RawMaterialPage from './components/RawMaterialPage';
import AssociationPage from './components/AssociationPage';
import ProductionSuggestionPage from './components/ProductionSuggestionPage';
import './App.css';

const tabs = [
  { label: 'Products', component: <ProductPage /> },
  { label: 'Raw Materials', component: <RawMaterialPage /> },
  { label: 'Association', component: <AssociationPage /> },
  { label: 'Production Suggestion', component: <ProductionSuggestionPage /> },
];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    dispatch({ type: 'CLEAR_USER' });
  };

  if (!user) {
    return (
      <div className="container">
        <h1 className="main-title">Gerenciamento de Inventário</h1>
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="container devui-bg">
      {/* Professional Header with User Profile */}
      <header style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          <h1 className="main-title devui-title" style={{ marginBottom: '0.25rem' }}>Gerenciamento de Inventário</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>Sistema de Controle de Produtos e Matérias-primas</p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingRight: '1.5rem',
            borderRight: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              {getInitials(user.name)}
            </div>
            <div>
              <p style={{ color: '#a78bfa', fontSize: '0.8rem', margin: '0 0 0.2rem 0', fontWeight: 500 }}>LOGADO</p>
              <p style={{ color: '#f3f4f6', fontSize: '1rem', fontWeight: 600, margin: 0 }}>{user.name}</p>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0.2rem 0 0 0' }}>{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '0.625rem 1.25rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
            }}
            onMouseOver={(e) => e.target.style.background = '#dc2626'}
            onMouseOut={(e) => e.target.style.background = '#ef4444'}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="devui-tabs">
        {tabs.map((tab, idx) => (
          <div
            key={tab.label}
            className={`devui-tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="devui-card devui-content">
        {tabs[activeTab].component}
      </div>
      <footer className="footer-signature">DEV: Bruno de castro</footer>
      <ToastContainer 
        theme="dark" 
        limit={3}
        autoClose={3000}
        closeButton={true}
        newestOnTop={true}
        closeOnClick={true}
      />
    </div>
  );
}

export default App;
