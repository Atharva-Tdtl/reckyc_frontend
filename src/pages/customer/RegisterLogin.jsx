import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Toast } from '../../components/UI';
import API from '../../api/client';

export default function RegisterLogin() {
  const [tab, setTab] = useState('login');
  const [formData, setFormData] = useState({
    username: '', password: '', fullName: '', mobile: '', otp: '', email: ''
  });
  const [showOtp, setShowOtp] = useState(false);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const role = await login(formData.username, formData.password);
      if (role === 'Customer') navigate('/app/onboarding');
      else if (['Maker', 'Checker', 'Operations Manager', 'Field Agent'].includes(role)) navigate('/ops/cases');
      else navigate('/cxo/dashboard');
    } catch (err) {
      setToast({ message: 'Invalid credentials', type: 'danger' });
    }
  };

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!showOtp) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setShowOtp(true);
      API.post('/accounts/send-otp/', { email: formData.email, otp: code })
        .then(() => {
          setToast({ message: `Verification code sent to ${formData.email}.`, type: 'success' });
        })
        .catch((err) => {
          console.error("Email delivery failed:", err);
          setToast({ message: "Failed to send email. Check backend logs.", type: 'danger' });
        });
      return;
    }
    
    if (enteredOtp !== generatedOtp) {
      setToast({ message: 'Invalid OTP.', type: 'danger' });
      return;
    }

    try {
      await API.post('/accounts/', { 
        username: formData.email.split('@')[0],
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName
      });
      await login(formData.email.split('@')[0], formData.password);
      setToast({ message: 'Account created!', type: 'success' });
      setTimeout(() => navigate('/app/onboarding'), 1500);
    } catch(err) {
      setToast({ message: 'Registration failed', type: 'danger' });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: '100vh', background: '#ffffff' }}>
      {/* Brand Side */}
      <div style={{ 
        background: '#020617', 
        padding: '80px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(2,6,23,0) 70%)' }}></div>
        
        <div style={{ zIndex: 2 }}>
          <div style={{ background: '#ef4444', width: '50px', height: '50px', borderRadius: '14px', display: 'grid', placeItems: 'center', marginBottom: '40px', boxShadow: '0 0 30px rgba(239,68,68,0.4)' }}>
            <span style={{ fontSize: '32px' }}>🛡️</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '24px', letterSpacing: '-1px' }}>
            Enterprise <br/><span style={{ color: '#3b82f6' }}>Identity Portal.</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '400px' }}>
            Experience the future of secure onboarding with AI-powered verification and real-time risk intelligence.
          </p>
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px', color: '#475569', fontSize: '13px' }}>
           © 2026 KYC Shield Enterprise. Certified by RBI & NHB.
        </div>
      </div>

      {/* Form Side */}
      <div style={{ display: 'grid', placeItems: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
              {tab === 'login' ? 'Enter your credentials to access the terminal' : 'Join the enterprise onboarding network'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '6px', background: '#f1f5f9', borderRadius: '16px', marginBottom: '40px' }}>
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ 
                  flex: 1, padding: '12px', borderRadius: '12px', border: 0, fontSize: '14px', fontWeight: '800', cursor: 'pointer',
                  background: tab === t ? 'white' : 'transparent', color: tab === t ? '#2563eb' : '#64748b',
                  boxShadow: tab === t ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', textTransform: 'capitalize'
              }}>{t}</button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'grid', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>User ID</label>
                <input 
                  type="text" required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                  placeholder="e.g. admin" style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>Password</label>
                <input 
                  type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••" style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '15px' }}
                />
              </div>
              <Button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: '#1e293b', fontSize: '16px', fontWeight: '800' }}>
                Access Terminal
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'grid', gap: '24px' }}>
              {!showOtp ? (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>Full Name</label>
                    <input type="text" required placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>Email</label>
                    <input type="email" required placeholder="john@tdtl.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }} />
                  </div>
                  <Button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: '#2563eb' }}>Verify via Email</Button>
                </>
              ) : (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', textAlign: 'center', marginBottom: '20px' }}>Verification Code</label>
                    <input type="text" maxLength="6" required autoFocus value={enteredOtp} onChange={e => setEnteredOtp(e.target.value)} placeholder="000000" style={{ width: '100%', textAlign: 'center', fontSize: '32px', fontWeight: '900', letterSpacing: '12px', border: 'none', background: '#f8fafc', padding: '20px', borderRadius: '16px' }} />
                  </div>
                  <Button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: '#1e293b' }}>Register</Button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
