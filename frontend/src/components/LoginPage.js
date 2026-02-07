import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.name && form.email) {
      dispatch({
        type: 'SET_USER',
        payload: { name: form.name, email: form.email, timestamp: new Date().toLocaleString() }
      });
      setIsLoggedIn(true);
    }
  }

  function handleLogout() {
    dispatch({ type: 'CLEAR_USER' });
    setForm({ name: '', email: '' });
    setIsLoggedIn(false);
  }

  if (isLoggedIn) {
    return (
      <div style={{
        padding: '1.5rem',
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <p style={{ color: '#a78bfa', fontSize: '0.9rem', margin: '0 0 0.5rem 0' }}>Logged in user</p>
          <p style={{ color: '#f3f4f6', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{form.name}</p>
          <p style={{ color: '#d1d5db', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{form.email}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      marginTop: '2rem'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#a78bfa',
        marginBottom: '2rem',
        fontSize: '1.75rem'
      }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          autoComplete="name"
          required
          style={{
            padding: '0.875rem 1rem',
            fontSize: '1rem',
            background: '#2d2d2d',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#f3f4f6',
            borderRadius: '6px',
            fontFamily: 'inherit'
          }}
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          autoComplete="email"
          required
          style={{
            padding: '0.875rem 1rem',
            fontSize: '1rem',
            background: '#2d2d2d',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#f3f4f6',
            borderRadius: '6px',
            fontFamily: 'inherit'
          }}
        />
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
            fontFamily: 'inherit'
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
