import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin, onShowRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Koneksi ke server gagal';
      alert('Login failed: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      height: '100vh',
      display: 'flex',
      overflow: 'hidden'
    }}>
      <div className="left-side" style={{
        flex: 1,
        background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), #234',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '120px',
          fontWeight: '900',
          textAlign: 'center',
          lineHeight: '1.1',
          zIndex: 1
        }}>
          NS<br/>GAMES
        </div>
      </div>
      
      <div className="right-side" style={{
        flex: 1,
        background: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 40px',
        overflowY: 'auto'
      }}>
        <div className="top-nav" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '30px',
          marginBottom: '20px'
        }}>
          <span style={{ color: '#333', fontSize: '18px', fontWeight: '500' }}>Login</span>
          <button 
            onClick={onShowRegister}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: '18px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Daftar
          </button>
        </div>

        <div className="logo-box" style={{
          background: 'black',
          color: 'white',
          padding: '20px 40px',
          textAlign: 'center',
          margin: '0 auto 30px',
          maxWidth: '400px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            marginBottom: '5px'
          }}>NS Games</h1>
          <p style={{
            fontSize: '16px',
            fontWeight: '300'
          }}>since 2025</p>
        </div>

        <div className="login-form" style={{
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '20px',
            color: '#333'
          }}>Login</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '16px'
              }}>Email</label>
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: 'none',
                  background: '#e8e8e8',
                  borderRadius: '4px',
                  fontSize: '16px',
                  color: '#666'
                }}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '16px'
              }}>Password</label>
              <input
                type="password"
                placeholder="**********"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: 'none',
                  background: '#e8e8e8',
                  borderRadius: '4px',
                  fontSize: '16px',
                  color: '#666'
                }}
                required
              />
            </div>
            
            <div className="forgot-password" style={{
              textAlign: 'right',
              marginTop: '10px'
            }}>
              <a href="#" style={{
                color: '#4169E1',
                textDecoration: 'none',
                fontSize: '14px'
              }}>Lupa Kata Sandi ?</a>
            </div>
            
            <div className="button-group" style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-login"
                style={{
                  padding: '15px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: '#4169E1',
                  color: 'white',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
              
              <button
                type="button"
                onClick={onShowRegister}
                className="btn btn-daftar"
                style={{
                  padding: '15px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: '#4169E1',
                  color: 'white',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                Daftar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;