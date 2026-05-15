import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../../components/UI';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page" style={{ background: 'white', minHeight: '100vh' }}>
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 8%', background: 'rgba(255,255,255,0.8)', 
        backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 1000,
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ fontSize: '32px' }}>🛡️</div>
          <b style={{ fontSize: '22px', color: '#0f172a', fontFamily: 'Outfit' }}>KYC Shield</b>
        </div>
        <Button variant="secondary" onClick={() => navigate('/login')}>Login / Register</Button>
      </header>

      <section style={{ 
        padding: '120px 8%', textAlign: 'center', 
        background: 'radial-gradient(circle at top right, #eff6ff 0%, #ffffff 50%, #f5f3ff 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(37, 99, 235, 0.03)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.03)', borderRadius: '50%' }}></div>
        
        <h1 style={{ fontSize: '64px', fontWeight: '800', marginBottom: '24px', color: '#0f172a', lineHeight: 1.1 }}>
          Complete your KYC in <span style={{ color: 'var(--primary)', position: 'relative' }}>under 5 minutes
            <svg style={{ position: 'absolute', bottom: '-8px', left: 0, width: '100%' }} height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6C30 2 100 2 198 6" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
        </h1>
        <p style={{ fontSize: '20px', color: '#64748b', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.6 }}>
          Experience the future of onboarding with AI-powered identity verification. 
          Secure, seamless, and built for modern finance.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/login')} style={{ padding: '18px 36px', fontSize: '16px', borderRadius: '16px' }}>Apply for Home Loan</Button>
          <Button variant="secondary" onClick={() => navigate('/login')} style={{ padding: '18px 36px', fontSize: '16px', borderRadius: '16px' }}>Track My Status</Button>
        </div>
        
        <div style={{ marginTop: '80px', display: 'flex', gap: '40px', justifyContent: 'center', opacity: 0.6, flexWrap: 'wrap' }}>
          {['RBI COMPLIANT', 'NHB CERTIFIED', 'PMLA READY', 'CKYC INTEGRATED'].map(tag => (
            <span key={tag} style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em' }}>● {tag}</span>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 8%', background: '#f8fafc' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '64px', color: '#0f172a' }}>How it works</h2>
        <div className="grid four" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {[
            { step: 1, title: 'Apply', desc: 'Fill in your basic details and loan requirements in minutes.', icon: '📝' },
            { step: 2, title: 'Upload', desc: 'Submit Aadhaar, PAN and financial docs via secure drag-and-drop.', icon: '📤' },
            { step: 3, title: 'AI Verify', desc: 'Our agents perform real-time extraction and liveness checks.', icon: '🤖' },
            { step: 4, title: 'Approve', desc: 'Get your official KYC approval status instantly.', icon: '✅' }
          ].map(item => (
            <Card key={item.step} style={{ textAlign: 'center', padding: '40px', border: '0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '48px', marginBottom: '24px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '22px', marginBottom: '12px' }}>{item.title}</h3>
              <p className="muted" style={{ fontSize: '15px', lineHeight: 1.6 }}>{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer style={{ padding: '60px 8%', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
        <p className="muted" style={{ fontSize: '14px' }}>© 2026 KYC Shield Automation Platform. Built for Housing Finance Excellence.</p>
      </footer>
    </div>
  );
}
