import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.name && form.email && form.password) {
      dispatch({
        type: 'SET_USER',
        payload: { 
          name: form.name, 
          email: form.email, 
          timestamp: new Date().toLocaleString(),
          avatar: getInitials(form.name)
        }
      });
      setIsLoggedIn(true);
    }
  }

  function handlePasswordReset(e) {
    e.preventDefault();
    if (recoveryEmail) {
      setRecoveryMessage(`Recovery email sent to ${recoveryEmail}. Check your inbox for instructions.`);
      setTimeout(() => {
        setRecoveryEmail('');
        setActiveTab('login');
        setRecoveryMessage('');
      }, 3000);
    }
  }

  function handleLogout() {
    dispatch({ type: 'CLEAR_USER' });
    setForm({ name: '', email: '', password: '' });
    setIsLoggedIn(false);
    setActiveTab('login');
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  if (isLoggedIn) {
    return (
      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            {form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div>
            <p style={{ color: '#a78bfa', fontSize: '0.85rem', margin: '0 0 0.3rem 0', fontWeight: 500 }}>Usuário Logado</p>
            <p style={{ color: '#f3f4f6', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{form.name}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>{form.email}</p>
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
    );
  }

  return (
    <div style={{
      maxWidth: '450px',
      margin: '0 auto',
      marginTop: '2rem'
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <button
          onClick={() => setActiveTab('login')}
          style={{
            padding: '1rem 1.5rem',
            background: activeTab === 'login' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: 'none',
            color: activeTab === 'login' ? '#a78bfa' : '#9ca3af',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'login' ? '2px solid #8b5cf6' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          Entrar
        </button>
        <button
          onClick={() => setActiveTab('recover')}
          style={{
            padding: '1rem 1.5rem',
            background: activeTab === 'recover' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: 'none',
            color: activeTab === 'recover' ? '#a78bfa' : '#9ca3af',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'recover' ? '2px solid #8b5cf6' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          Recuperar Senha
        </button>
      </div>

      {/* Login Tab */}
      {activeTab === 'login' && (
        <div style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#a78bfa',
            marginBottom: '2rem',
            fontSize: '1.75rem',
            fontWeight: 700
          }}>Acesso ao Sistema</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            {/* Name Input */}
            <div>
              <label style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Nome Completo</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
                autoComplete="name"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  background: '#2d2d2d',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#f3f4f6',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
              />
            </div>

            {/* Email Input */}
            <div>
              <label style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Email Corporativo</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu.email@empresa.com"
                autoComplete="email"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  background: '#2d2d2d',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#f3f4f6',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                  autoComplete="password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 1rem',
                    fontSize: '1rem',
                    background: '#2d2d2d',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#f3f4f6',
                    borderRadius: '6px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'all 0.3s ease',
                    paddingRight: '2.5rem'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                marginTop: '0.5rem'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
              onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
            >
              Entrar no Sistema
            </button>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('recover')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a78bfa',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textDecoration: 'underline'
                }}
              >
                Perdeu sua senha?
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Recovery Tab */}
      {activeTab === 'recover' && (
        <div style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#a78bfa',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>Recuperar Senha</h2>

          <p style={{
            color: '#d1d5db',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            Digite seu email corporativo e enviaremos instruções para recuperar sua senha.
          </p>

          {recoveryMessage && (
            <div style={{
              padding: '1rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              color: '#86efac',
              fontSize: '0.95rem'
            }}>
              {recoveryMessage}
            </div>
          )}

          <form onSubmit={handlePasswordReset} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Email Corporativo</label>
              <input
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: '1rem',
                  background: '#2d2d2d',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#f3f4f6',
                  borderRadius: '6px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)'}
              />
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
              onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
            >
              Enviar Instruções
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('login')}
              style={{
                background: 'transparent',
                color: '#a78bfa',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '0.875rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '6px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.borderColor = 'rgba(139, 92, 246, 0.6)';
                e.target.background = 'rgba(139, 92, 246, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.borderColor = 'rgba(139, 92, 246, 0.3)';
                e.target.background = 'transparent';
              }}
            >
              Voltar ao Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
