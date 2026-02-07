import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LoginPage() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  
  // Login state
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  
  // Signup state
  const [signupForm, setSignupForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    agreeTerms: false 
  });
  const [signupMessage, setSignupMessage] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password recovery state
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState('login');

  function handleLoginChange(e) {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  }

  function handleSignupChange(e) {
    const { name, value, type, checked } = e.target;
    setSignupForm({ 
      ...signupForm, 
      [name]: type === 'checkbox' ? checked : value 
    });
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (loginForm.name && loginForm.email && loginForm.password) {
      dispatch({
        type: 'SET_USER',
        payload: { 
          name: loginForm.name, 
          email: loginForm.email, 
          timestamp: new Date().toLocaleString(),
          avatar: getInitials(loginForm.name)
        }
      });
      // Form cleared after successful login
      setLoginForm({ name: '', email: '', password: '' });
    }
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setSignupMessage('Please fill in all fields.');
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupMessage('Passwords do not match.');
      return;
    }

    if (signupForm.password.length < 6) {
      setSignupMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!signupForm.agreeTerms) {
      setSignupMessage('You must accept the Terms of Use and Privacy Policy.');
      return;
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setEmailVerificationCode(code);
    setShowVerification(true);
    setSignupMessage(`Verification code sent to ${signupForm.email}`);
  }

  function handleVerifyEmail(e) {
    e.preventDefault();
    
    if (verificationInput === emailVerificationCode) {
      dispatch({
        type: 'SET_USER',
        payload: { 
          name: signupForm.name, 
          email: signupForm.email, 
          timestamp: new Date().toLocaleString(),
          avatar: getInitials(signupForm.name)
        }
      });
      // Reset signup form after successful registration
      setSignupForm({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        agreeTerms: false 
      });
      setShowVerification(false);
      setVerificationInput('');
      setSignupMessage('');
    } else {
      setSignupMessage('Invalid verification code. Try again.');
    }
  }

  function handlePasswordReset(e) {
    e.preventDefault();
    if (recoveryEmail) {
      setRecoverySuccess(true);
      setRecoveryMessage(`Recovery email sent to ${recoveryEmail}. Check your inbox.`);
      setTimeout(() => {
        setRecoveryEmail('');
        setRecoverySuccess(false);
        setRecoveryMessage('');
        setActiveTab('login');
      }, 3000);
    }
  }

  function handleLogout() {
    dispatch({ type: 'CLEAR_USER' });
    setLoginForm({ name: '', email: '', password: '' });
    setActiveTab('login');
  }

  function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  if (user) {
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
            {getInitials(user.name)}
          </div>
          <div>
            <p style={{ color: '#a78bfa', fontSize: '0.85rem', margin: '0 0 0.3rem 0', fontWeight: 500 }}>Logged In User</p>
            <p style={{ color: '#f3f4f6', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{user.name}</p>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: '0.25rem 0 0 0' }}>{user.email}</p>
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
          Logout
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
        gap: '0',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(139, 92, 246, 0.2)'
      }}>
        <button
          onClick={() => {
            setActiveTab('login');
            setSignupMessage('');
            setShowVerification(false);
            setRecoveryMessage('');
            setRecoverySuccess(false);
          }}
          style={{
            flex: 1,
            padding: '1rem 1.5rem',
            background: activeTab === 'login' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'login' ? '3px solid #8b5cf6' : 'none',
            color: activeTab === 'login' ? '#a78bfa' : '#9ca3af',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Login
        </button>
        <button
          onClick={() => {
            setActiveTab('signup');
            setSignupMessage('');
            setShowVerification(false);
          }}
          style={{
            flex: 1,
            padding: '1rem 1.5rem',
            background: activeTab === 'signup' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'signup' ? '3px solid #8b5cf6' : 'none',
            color: activeTab === 'signup' ? '#a78bfa' : '#9ca3af',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            setActiveTab('recovery');
            setRecoveryMessage('');
            setRecoverySuccess(false);
          }}
          style={{
            flex: 1,
            padding: '1rem 1.5rem',
            background: activeTab === 'recovery' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'recovery' ? '3px solid #8b5cf6' : 'none',
            color: activeTab === 'recovery' ? '#a78bfa' : '#9ca3af',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Password Recovery
        </button>
      </div>

      {/* Login Tab */}
      {activeTab === 'login' && (
        <div style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '0 0 12px 12px',
          borderTop: 'none',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#a78bfa',
            marginBottom: '2rem',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>System Access</h2>
          
          <form onSubmit={handleLoginSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label htmlFor="login-name" style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Full Name</label>
              <input
                id="login-name"
                name="name"
                value={loginForm.name}
                onChange={handleLoginChange}
                placeholder="Enter your name"
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
              <label htmlFor="login-email" style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Corporate Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="your.email@company.com"
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="login-password" style={{
                  color: '#d1d5db',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'block'
                }}>Password</label>
                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('recovery'); }} style={{
                  color: '#a78bfa',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }} onMouseOver={(e) => e.target.style.opacity = '0.7'} onMouseOut={(e) => e.target.style.opacity = '1'}>
                  Forgot your password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                marginTop: '0.5rem',
                width: '100%'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
              onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
            >
              Log In
            </button>
          </form>
        </div>
      )}

      {/* Signup Tab */}
      {activeTab === 'signup' && (
        <div style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '0 0 12px 12px',
          borderTop: 'none',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#a78bfa',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>Create Account</h2>

          {!showVerification ? (
            <>
              {signupMessage && (
                <div style={{
                  padding: '0.875rem',
                  background: signupMessage.includes('fill') || signupMessage.includes('invalid') || signupMessage.includes('match') || signupMessage.includes('least') || signupMessage.includes('accept') 
                    ? 'rgba(239, 68, 68, 0.15)' 
                    : 'rgba(34, 197, 94, 0.15)',
                  border: signupMessage.includes('fill') || signupMessage.includes('invalid') || signupMessage.includes('match') || signupMessage.includes('least') || signupMessage.includes('accept')
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                  color: signupMessage.includes('fill') || signupMessage.includes('invalid') || signupMessage.includes('match') || signupMessage.includes('least') || signupMessage.includes('accept')
                    ? '#fca5a5'
                    : '#86efac',
                  fontSize: '0.9rem'
                }}>
                  {signupMessage}
                </div>
              )}

              <form onSubmit={handleSignupSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label htmlFor="signup-name" style={{
                    color: '#d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    value={signupForm.name}
                    onChange={handleSignupChange}
                    placeholder="Your full name"
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
                  <label htmlFor="signup-email" style={{
                    color: '#d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Corporate Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    placeholder="your.email@company.com"
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
                  <label htmlFor="signup-password" style={{
                    color: '#d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
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
                  <label htmlFor="signup-confirm-password" style={{
                    color: '#d1d5db',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={signupForm.confirmPassword}
                      onChange={handleSignupChange}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
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

                <div style={{
                  padding: '1rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '6px'
                }}>
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '0.85rem',
                    margin: '0 0 0.75rem 0',
                    lineHeight: '1.4'
                  }} id="terms-description">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                  </p>
                  <label htmlFor="agree-terms" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    color: '#d1d5db'
                  }}>
                    <input
                      id="agree-terms"
                      type="checkbox"
                      name="agreeTerms"
                      checked={signupForm.agreeTerms}
                      onChange={handleSignupChange}
                      aria-describedby="terms-description"
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontSize: '0.9rem' }}>
                      I accept the Terms of Use and Privacy Policy
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
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
                  onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
                >
                  Proceed to Verification
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Email Verification Screen */}
              <div style={{
                textAlign: 'center',
                padding: '2rem 0'
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
                }}>Verify Your Email</h3>
                
                <p style={{
                  color: '#d1d5db',
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5'
                }}>
                  A verification code has been sent to:<br/>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{signupForm.email}</span>
                </p>

                {signupMessage && (
                  <div style={{
                    padding: '1rem',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px',
                    marginBottom: '1.5rem',
                    color: '#86efac',
                    fontSize: '0.9rem'
                  }}>
                    {signupMessage}
                  </div>
                )}

                <form onSubmit={handleVerifyEmail} style={{ display: 'grid', gap: '1.25rem' }}>
                  <div>
                    <label htmlFor="verify-code" style={{
                      color: '#d1d5db',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: '0.75rem'
                    }}>Enter the 6-digit code:</label>
                    <input
                      id="verify-code"
                      type="text"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value.slice(0, 6))}
                      placeholder="000000"
                      maxLength="6"
                      inputMode="numeric"
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
                      width: '100%'
                    }}
                    onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
                    onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
                  >
                    Confirm Verification
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowVerification(false);
                      setVerificationInput('');
                      setSignupMessage('');
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
                    Back
                  </button>
                </form>

                <p style={{
                  color: '#9ca3af',
                  fontSize: '0.85rem',
                  marginTop: '1.5rem'
                }}>
                  Did not receive the code? Check your spam folder.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Password Recovery Tab */}
      {activeTab === 'recovery' && (
        <div style={{
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '0 0 12px 12px',
          borderTop: 'none',
          backdropFilter: 'blur(10px)',
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#a78bfa',
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>Reset Password</h2>

          <p style={{
            color: '#d1d5db',
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            Enter your corporate email and we'll send you instructions to reset your password.
          </p>

          {recoveryMessage && (
            <div style={{
              padding: '1rem',
              background: recoverySuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: recoverySuccess ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              color: recoverySuccess ? '#86efac' : '#fca5a5',
              fontSize: '0.95rem'
            }}>
              {recoveryMessage}
            </div>
          )}

          <form onSubmit={handlePasswordReset} style={{ display: 'grid', gap: '1.25rem' }}>
            <div>
              <label htmlFor="recovery-email" style={{
                color: '#d1d5db',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.5rem'
              }}>Corporate Email</label>
              <input
                id="recovery-email"
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="your.email@company.com"
                autoComplete="email"
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
                transition: 'all 0.3s ease',
                width: '100%'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)'}
              onMouseOut={(e) => e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)'}
            >
              Send Recovery Email
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setRecoveryEmail('');
                setRecoveryMessage('');
                setRecoverySuccess(false);
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
                transition: 'all 0.3s ease',
                width: '100%'
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
              Back to Login
            </button>
          </form>

          <p style={{
            color: '#9ca3af',
            fontSize: '0.85rem',
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            Did not receive the email? Check your spam folder or contact support.
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
