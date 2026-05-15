import React from 'react';

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function Button({ children, variant = "primary", onClick, disabled, loading, type = "button" }) {
  return (
    <button 
      type={type}
      className={`btn ${variant === 'secondary' ? 'secondary' : ''}`} 
      onClick={onClick} 
      disabled={disabled || loading}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

export function Progress({ value, color }) {
  return (
    <div className="progress">
      <span style={{ width: `${value}%`, backgroundColor: color }}></span>
    </div>
  );
}

export function PageTitle({ title, subtitle }) {
  return (
    <div className="page-title">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = "600px" }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{
      position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      paddingTop: '50px', zIndex: 1000
    }}>
      <div className="card" style={{ width, minHeight: '500px', position: 'relative' }}>
        <div className="space" style={{ marginBottom: '20px' }}>
          <h3>{title}</h3>
          <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, type = "info", onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`badge ${type}`} style={{
      position: 'fixed', bottom: '20px', right: '20px', padding: '12px 20px', 
      boxShadow: 'var(--shadow)', zIndex: 2000
    }}>
      {message}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="spinner" style={{
      width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite'
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function Avatar({ name, size = "40px" }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: 'var(--primary2)',
      color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 'bold'
    }}>
      {initials}
    </div>
  );
}
