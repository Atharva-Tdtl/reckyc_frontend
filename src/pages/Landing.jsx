import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1e293b', fontFamily: '"Outfit", sans-serif' }}>
      {/* Premium Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 80px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#ef4444', width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>🛡️</div>
          <b style={{ fontSize: '20px', letterSpacing: '-0.5px' }}>KYC Shield</b>
        </div>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', fontSize: '15px', fontWeight: '600' }}>
          <span style={{ cursor: 'pointer' }}>Products</span>
          <span style={{ cursor: 'pointer' }}>Enterprise</span>
          <span style={{ cursor: 'pointer' }}>Security</span>
          <Button style={{ background: '#1e293b', borderRadius: '12px', padding: '10px 24px' }} onClick={() => navigate('/login')}>Bank Login</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '100px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '60px' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-block', background: '#ecfdf5', color: '#059669', padding: '6px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold', marginBottom: '24px' }}>
            ✨ AI-POWERED ONBOARDING v2.0
          </div>
          <h1 style={{ fontSize: '72px', lineHeight: '1.1', fontWeight: '900', color: '#1e293b', marginBottom: '30px' }}>
            Complete your KYC in <span style={{ color: '#2563eb' }}>under 5 minutes</span>
          </h1>
          <p style={{ fontSize: '20px', lineHeight: '1.6', color: '#64748b', marginBottom: '40px', maxWidth: '540px' }}>
            Experience the next generation of banking. Our agentic AI automates identity extraction and risk scoring, getting you verified in real-time.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Button style={{ background: '#2563eb', padding: '16px 40px', borderRadius: '16px', fontSize: '16px', fontWeight: '800', boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.3)' }} onClick={() => navigate('/login')}>Apply for Home Loan</Button>
            <Button variant="secondary" style={{ padding: '16px 40px', borderRadius: '16px', fontSize: '16px', border: '2px solid #f1f5f9' }}>Track My Status</Button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 1 }}></div>
          <img 
            src="/kyc_hero_visual_1778836324104.png" 
            alt="Hero" 
            style={{ width: '100%', borderRadius: '40px', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.15)', position: 'relative', zIndex: 2 }} 
          />
        </div>
      </div>

      {/* Trust & Certification Section */}
      <div style={{ padding: '60px 80px', background: '#f8fafc', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '40px' }}>CERTIFIED BY WORLD-CLASS REGULATORS</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', alignItems: 'center', opacity: 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>🏦</div>
            <b style={{ fontSize: '18px' }}>RBI</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>🏢</div>
            <b style={{ fontSize: '18px' }}>NHB</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>⚖️</div>
            <b style={{ fontSize: '18px' }}>PMLA</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>🔄</div>
            <b style={{ fontSize: '18px' }}>CKYC</b>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div style={{ padding: '120px 80px' }}>
        <div className="grid three" style={{ gap: '40px' }}>
          {[
            { title: 'AI OCR Extraction', desc: 'Auto-extract identity details from Aadhaar & PAN with 99.8% precision.', icon: '⚡' },
            { title: 'Liveness Detection', desc: 'Real-time face matching and liveness checks to prevent spoofing.', icon: '👤' },
            { title: 'AML Risk Scoring', desc: 'Instant background checks against global sanctions and PEP lists.', icon: '🛡️' }
          ].map((f, i) => (
            <div key={i} style={{ padding: '40px', borderRadius: '32px', background: '#fff', border: '1px solid #f1f5f9', transition: 'transform 0.3s' }} className="hover-scale">
              <div style={{ fontSize: '40px', marginBottom: '24px' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '16px' }}>{f.title}</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
