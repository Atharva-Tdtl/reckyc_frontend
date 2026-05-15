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
      // Simulate sending to backend for external delivery
      API.post('/accounts/send-otp/', { email: formData.email, otp: code })
        .then(() => {
          setToast({ message: `Verification code sent to ${formData.email}. Please check your inbox.`, type: 'success' });
        })
        .catch((err) => {
          console.error("Email delivery failed:", err);
          setToast({ message: "Failed to send email. Check backend logs.", type: 'danger' });
        });
      return;
    }
    
    if (enteredOtp !== generatedOtp) {
      setToast({ message: 'Invalid OTP. Please check the code shown in the notification.', type: 'danger' });
      return;
    }

    try {
      // Create account
      await API.post('/accounts/', { 
        username: formData.email.split('@')[0], // Use email prefix as username for demo
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName
      });
      
      // Auto-login
      await login(formData.email.split('@')[0], formData.password);
      setToast({ message: 'Account created! Starting onboarding...', type: 'success' });
      setTimeout(() => navigate('/app/onboarding'), 1500);
    } catch(err) {
      setToast({ message: 'Registration failed', type: 'danger' });
    }
  };

  return (
    <div style={{ 
      display: 'grid', placeItems: 'center', minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', maxWidth: '480px', padding: '48px', 
        borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        border: '0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>KYC Shield</h2>
          <p className="muted" style={{ fontSize: '15px' }}>Secure Onboarding Portal</p>
        </div>

        <div style={{ 
          display: 'flex', gap: '8px', padding: '6px', 
          background: '#f1f5f9', borderRadius: '16px', marginBottom: '32px' 
        }}>
          {['login', 'register'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              style={{ 
                flex: 1, padding: '10px', borderRadius: '12px', border: 0, 
                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
                background: tab === t ? 'white' : 'transparent',
                color: tab === t ? 'var(--primary)' : 'var(--muted)',
                boxShadow: tab === t ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="grid" style={{ gap: '20px' }}>
            <div className="role-switcher">
              <label>Username</label>
              <input 
                type="text" required 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})}
                placeholder="e.g. admin or customer_user"
              />
            </div>
            <div className="role-switcher">
              <label>Password</label>
              <input 
                type="password" required 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" style={{ marginTop: '12px', width: '100%', padding: '16px' }}>Sign In</Button>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <a href="#" className="muted" style={{ fontSize: '14px', fontWeight: '500' }} onClick={(e) => { e.preventDefault(); setToast({ message: 'Reset link sent', type: 'info' }); }}>Forgot password?</a>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="grid" style={{ gap: '20px' }}>
            {!showOtp ? (
              <>
                <div className="role-switcher">
                  <label>Full Name</label>
                  <input type="text" required placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="role-switcher">
                  <label>Email Address</label>
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <Button type="submit" style={{ width: '100%', padding: '16px' }}>Get OTP on Email</Button>
              </>
            ) : (
              <>
                <div className="role-switcher">
                  <label>Verification Code (Sent to {formData.email})</label>
                  <input 
                    type="text" maxLength="6" required autoFocus 
                    value={enteredOtp}
                    onChange={e => setEnteredOtp(e.target.value)}
                    placeholder="000000" 
                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '20px', fontWeight: '800' }} 
                  />
                </div>
                <div className="role-switcher">
                  <label>Set Password</label>
                  <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
                </div>
                <Button type="submit" style={{ width: '100%', padding: '16px' }}>Register & Continue</Button>
                <div style={{ textAlign: 'center' }}>
                  <button className="linkbtn" style={{ background: 'transparent', fontSize: '13px' }} onClick={() => setShowOtp(false)}>Back to Email</button>
                </div>
              </>
            )}
          </form>
        )}
      </Card>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
