import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: '"Outfit", sans-serif' }}>
      {/* Enterprise Sticky Navbar */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 80px', position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)', width: '36px', height: '36px', borderRadius: '10px', display: 'grid', placeItems: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>🛡️</div>
          <div>
            <b style={{ fontSize: '22px', letterSpacing: '-0.5px' }}>KYC Shield</b>
            <div style={{ fontSize: '10px', opacity: 0.5, fontWeight: '700', letterSpacing: '0.1em' }}>ENTERPRISE SOLUTION</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>
          <span style={{ cursor: 'pointer', color: '#f8fafc' }}>Platform</span>
          <span style={{ cursor: 'pointer' }}>Solutions</span>
          <span style={{ cursor: 'pointer' }}>Compliance</span>
          <span style={{ cursor: 'pointer' }}>Security</span>
          <Button 
            style={{ background: '#2563eb', borderRadius: '12px', padding: '12px 28px', border: 'none', fontWeight: '800', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)' }} 
            onClick={() => navigate('/login')}
          >
            System Access
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ padding: '100px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '80px', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37, 99, 235, 0.1)', color: '#60a5fa', padding: '8px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(37, 99, 235, 0.2)', marginBottom: '30px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#60a5fa', borderRadius: '50%' }}></span>
            AGENTIC AI POWERED ONBOARDING
          </div>
          <h1 style={{ fontSize: '72px', lineHeight: '1.05', fontWeight: '900', marginBottom: '30px', background: 'linear-gradient(to bottom, #ffffff 50%, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Transforming KYC into <br/><span style={{ color: '#2563eb', WebkitTextFillColor: '#2563eb' }}>Digital Intelligence.</span>
          </h1>
          <p style={{ fontSize: '20px', lineHeight: '1.6', color: '#94a3b8', marginBottom: '45px', maxWidth: '580px' }}>
            Experience the future of onboarding with Agentic AI. We automate identity verification, liveness checks, and risk scoring for modern global finance.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button 
              style={{ background: '#2563eb', padding: '20px 45px', borderRadius: '16px', fontSize: '16px', fontWeight: '800', border: 'none' }} 
              onClick={() => navigate('/login')}
            >
              Get Started Now
            </Button>
            <Button variant="secondary" style={{ padding: '20px 45px', borderRadius: '16px', fontSize: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}>
              Watch Demo
            </Button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, rgba(2, 6, 23, 0) 70%)', zIndex: 1 }}></div>
           <img 
            src="/kyc_enterprise_hero_1778906958982.png" 
            alt="Enterprise Visual" 
            style={{ width: '100%', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative', zIndex: 2, border: '1px solid rgba(255,255,255,0.1)' }} 
           />
        </div>
      </div>

      {/* Regulatory Trust Bar */}
      <div style={{ padding: '60px 80px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.2em', color: '#475569' }}>REGULATORY COMPLIANCE STANDARDS</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', opacity: 0.8 }}>
          {['RBI', 'NHB', 'PMLA', 'CKYC', 'SEBI'].map(name => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
               <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', placeItems: 'center', fontSize: '20px' }}>🏛️</div>
               <b style={{ fontSize: '18px', color: '#94a3b8' }}>{name}</b>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Section */}
      <div style={{ padding: '120px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '800' }}>Engineered for <span style={{ color: '#2563eb' }}>High-Impact</span> Banking</h2>
        </div>
        <div className="grid three" style={{ gap: '30px' }}>
           {[
             { title: 'Agentic AI Processing', desc: 'Auto-extract identity details from Aadhaar & PAN with 99.9% AI precision.', icon: '⚡' },
             { title: 'Live Biometrics', desc: 'Real-time face matching and passive liveness checks to eliminate spoofing.', icon: '👤' },
             { title: 'Enterprise Risk Scoring', desc: 'Sub-second background checks against global sanctions and high-risk lists.', icon: '🛡️' }
           ].map((f, i) => (
             <div key={i} style={{ padding: '50px', borderRadius: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: '0.3s' }} className="hover-scale">
               <div style={{ fontSize: '42px', marginBottom: '30px' }}>{f.icon}</div>
               <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>{f.title}</h3>
               <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '15px' }}>{f.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
