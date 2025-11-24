import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = ({ onRegister, onShowLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authAPI.register(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onRegister(response.data.user);
    } catch (error) {
      alert('Register failed: ' + error.response?.data?.message);
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
          <button 
            onClick={onShowLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#333',
              fontSize: '18px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
          <span style={{ color: '#333', fontSize: '18px', fontWeight: '500' }}>Daftar</span>
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
          }}>Daftar</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '16px'
              }}>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              }}>Username</label>
              <input
                type="text"
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
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
              }}>Email</label>
              <input
                type="email"
                placeholder="nama@example.com"
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
              }}>Nomor Telepon</label>
              <input
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                placeholder="Minimal 8 karakter"
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
            
            <div className="button-group" style={{
              marginTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-daftar"
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
                {loading ? 'Loading...' : 'Daftar'}
              </button>
              
              <button
                type="button"
                onClick={onShowLogin}
                className="btn btn-login"
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;