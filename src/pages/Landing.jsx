import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

const Highlight = ({ children }) => (
  <span style={{ 
    background: '#dcfce7', 
    color: '#166534', 
    padding: '0 8px', 
    borderRadius: '8px', 
    display: 'inline-block',
    margin: '0 4px'
  }}>
    {children}
  </span>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b', fontFamily: '"Outfit", sans-serif' }}>
      {/* SaaS Style Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ color: '#10b981', fontSize: '24px' }}>🛡️</div>
          <div>
            <b style={{ fontSize: '20px', fontWeight: '800', color: '#064e3b' }}>KYC WIDGET</b>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold' }}>KYC Anti-fraud for your business</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center', color: '#64748b', fontWeight: '500', fontSize: '14px' }}>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>🏷️ Pricing</span>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>🧩 The widget</span>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>ℹ️ Our company</span>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>💬 Chat with us</span>
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Button 
            style={{ background: '#10b981', borderRadius: '100px', padding: '10px 24px', fontWeight: '700', border: 'none' }}
            onClick={() => navigate('/login')}
          >
            🔐 Create an account
          </Button>
          <span style={{ color: '#10b981', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login →</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', padding: '60px', alignItems: 'center', gap: '40px' }}>
        <div style={{ paddingRight: '40px' }}>
          <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1.1', color: '#064e3b', marginBottom: '30px' }}>
            Protect your <Highlight>SAAS</Highlight> from <Highlight>fake users</Highlight> with our <Highlight>smart KYC</Highlight>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', lineHeight: '1.6' }}>
            Automatically detect and prevent fraud with our AI-powered identity verification widget. Stop <b>fake accounts</b> and protect your revenue with intelligent triggers.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Button 
              style={{ background: '#10b981', padding: '18px 36px', borderRadius: '12px', fontSize: '16px', fontWeight: '800', border: 'none', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}
              onClick={() => navigate('/login')}
            >
              ✅ Start protecting now
            </Button>
            <span style={{ color: '#10b981', fontWeight: '700', cursor: 'pointer', borderBottom: '1px solid #10b981' }}>View our pricing →</span>
          </div>
          
          <div style={{ marginTop: '30px', color: '#94a3b8', fontSize: '14px' }}>No credit card required.</div>
        </div>

        {/* Right Side Illustration */}
        <div style={{ background: '#f0fff4', borderRadius: '40px', height: '600px', display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <img 
            src="/kyc_saas_illustration_1778906699386.png" 
            alt="SaaS Illustration" 
            style={{ width: '80%', zIndex: 2 }} 
          />
          {/* Floating Avatar Elements */}
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', background: 'white', padding: '10px 20px', borderRadius: '100px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 'bold' }}>
             <span style={{ color: '#10b981' }}>👤</span> Customers register to your platform
          </div>
        </div>
      </div>
    </div>
  );
}
