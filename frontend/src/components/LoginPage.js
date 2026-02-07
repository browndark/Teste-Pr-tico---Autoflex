import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sign Up Form
  const [signUpForm, setSignUpForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeTerms: false 
  });
  const [signUpMessage, setSignUpMessage] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSignUpChange(e) {
    const { name, value, type, checked } = e.target;
    setSignUpForm({ 
      ...signUpForm, 
      [name]: type === 'checkbox' ? checked : value 
    });
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

  function handleSignUp(e) {
    e.preventDefault();
    
    if (!signUpForm.name || !signUpForm.email || !signUpForm.password || !signUpForm.confirmPassword) {
      setSignUpMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setSignUpMessage('As senhas não correspondem.');
      return;
    }

    if (signUpForm.password.length < 6) {
      setSignUpMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!signUpForm.agreeTerms) {
      setSignUpMessage('Você deve aceitar os Termos de Uso e Privacidade.');
      return;
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailVerificationCode(code);
    setShowVerification(true);
    setSignUpMessage(`Código de verificação enviado para ${signUpForm.email}`);
  }

  function handleVerifyEmail(e) {
    e.preventDefault();
    
    if (verificationInput === emailVerificationCode) {
      // Registration successful
      dispatch({
        type: 'SET_USER',
        payload: { 
          name: signUpForm.name, 
          email: signUpForm.email, 
          timestamp: new Date().toLocaleString(),
          avatar: getInitials(signUpForm.name)
        }
      });
      setIsLoggedIn(true);
    } else {
      setSignUpMessage('Código de verificação inválido. Tente novamente.');
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
      maxWidth: '500px',
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
          onClick={() => {
            setActiveTab('login');
            setSignUpMessage('');
            setShowVerification(false);
            setVerificationInput('');
          }}
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
          onClick={() => {
            setActiveTab('signup');
            setSignUpMessage('');
            setShowVerification(false);
            setVerificationInput('');
          }}
          style={{
            padding: '1rem 1.5rem',
            background: activeTab === 'signup' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: 'none',
            color: activeTab === 'signup' ? '#a78bfa' : '#9ca3af',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'signup' ? '2px solid #8b5cf6' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          Cadastro
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
          </form>
        </div>
      )}

      {/* Sign Up Tab */}
      {activeTab === 'signup' && (
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
            fontSize: '1.75rem',
            fontWeight: 700
          }}>Criar Nova Conta</h2>

          {!showVerification ? (
            <>
              {signUpMessage && (
                <div style={{
                  padding: '1rem',
                  background: signUpMessage.includes('Todas') || signUpMessage.includes('inválido') || signUpMessage.includes('não correspondem') || signUpMessage.includes('mínimo') || signUpMessage.includes('aceitar') 
                    ? 'rgba(239, 68, 68, 0.15)' 
                    : 'rgba(34, 197, 94, 0.15)',
                  border: signUpMessage.includes('Todas') || signUpMessage.includes('inválido') || signUpMessage.includes('não correspondem') || signUpMessage.includes('mínimo') || signUpMessage.includes('aceitar')
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '6px',
                  marginBottom: '1.5rem',
                  color: signUpMessage.includes('Todas') || signUpMessage.includes('inválido') || signUpMessage.includes('não correspondem') || signUpMessage.includes('mínimo') || signUpMessage.includes('aceitar')
                    ? '#fca5a5'
                    : '#86efac',
                  fontSize: '0.95rem'
                }}>
                  {signUpMessage}
                </div>
              )}

              <form onSubmit={handleSignUp} style={{ display: 'grid', gap: '1.25rem' }}>
                <div>
                  <label style={{
                    color: '#d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Nome Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={signUpForm.name}
                    onChange={handleSignUpChange}
                    placeholder="Seu nome completo"
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
                    name="email"
                    value={signUpForm.email}
                    onChange={handleSignUpChange}
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
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={signUpForm.password}
                      onChange={handleSignUpChange}
                      placeholder="Mínimo 6 caracteres"
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

                <div>
                  <label style={{
                    color: '#d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Confirmar Senha</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={signUpForm.confirmPassword}
                      onChange={handleSignUpChange}
                      placeholder="Confirme sua senha"
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '6px'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: '#a78bfa', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Termos de Uso e Privacidade</h4>
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '0.85rem',
                      lineHeight: '1.6',
                      margin: 0
                    }}>
                      Ao registrar, você concorda com nossos Termos de Serviço e Política de Privacidade. Sua conta é protegida e seus dados serão utilizados apenas para fins de autenticação e gerenciamento do sistema.
                    </p>
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    color: '#d1d5db'
                  }}>
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={signUpForm.agreeTerms}
                      onChange={handleSignUpChange}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>
                      Eu li e aceito os Termos de Uso e Privacidade
                    </span>
                  </label>
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
                    transition: 'all 0.3s ease',
                    marginTop: '0.5rem'
                  }}
                  onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
                  onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
                >
                  Prosseguir para Verificação
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Email Verification Screen */}
              <div style={{
                textAlign: 'center',
                padding: '1rem 0'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                  📧
                </div>

                <h3 style={{
                  color: '#a78bfa',
                  fontSize: '1.3rem',
                  marginBottom: '0.5rem'
                }}>Verifique seu Email</h3>
                
                <p style={{
                  color: '#d1d5db',
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5'
                }}>
                  Um código de verificação foi enviado para:<br/>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{signUpForm.email}</span>
                </p>

                {signUpMessage && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px',
                    marginBottom: '1.5rem',
                    color: '#86efac',
                    fontSize: '0.9rem'
                  }}>
                    {signUpMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label style={{
                      color: '#d1d5db',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '0.75rem'
                    }}>Digite o código de 6 dígitos:</label>
                    <input
                      type="text"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value.slice(0, 6))}
                      placeholder="000000"
                      maxLength="6"
                      required
                      style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: '0.5rem',
                        textAlign: 'center',
                        background: '#2d2d2d',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        color: '#f3f4f6',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
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
                      padding: '1rem 1.5rem',
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
                    Confirmar Verificação
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowVerification(false);
                      setVerificationInput('');
                      setSignUpMessage('');
                    }}
                    style={{
                      background: 'transparent',
                      color: '#a78bfa',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      padding: '0.875rem 1.5rem',
                      fontSize: '0.95rem',
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
                    Voltar
                  </button>
                </form>

                <p style={{
                  color: '#9ca3af',
                  fontSize: '0.85rem',
                  marginTop: '1.5rem'
                }}>
                  Não recebeu o código? Verifique a pasta de spam ou solicite um novo envio.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
