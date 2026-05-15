import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge, Button } from './UI';

export default function Sidebar() {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = {
    'Customer': [
      { path: '/app/dashboard', label: 'My Dashboard', icon: '🏠' },
      { path: '/app/onboarding', label: 'KYC Onboarding', icon: '📝' },
      { path: '/app/vault', label: 'Document Vault', icon: '🔐' },
      { path: '/app/status', label: 'Status Tracker', icon: '📋' },
      { path: '/app/support', label: 'Help & Support', icon: '🎧' }
    ],
    'Maker': [
      { path: '/ops/dashboard', label: 'Ops Dashboard', icon: '📊' },
      { path: '/ops/cases?view=queue', label: 'Cases Queue', icon: '📥' },
      { path: '/ops/cases?view=reviews', label: 'My Reviews', icon: '✍️' },
      { path: '/ops/search', label: 'Customer Search', icon: '🔍' },
      { path: '/ops/performance', label: 'My Performance', icon: '📈' }
    ],
    'Checker': [
      { path: '/ops/dashboard', label: 'Approval Desk', icon: '🏦' },
      { path: '/ops/cases?view=queue', label: 'Pending Approvals', icon: '📥' },
      { path: '/ops/cases?view=reviews', label: 'Active Checking', icon: '✅' },
      { path: '/ops/audit', label: 'Audit Trail Explorer', icon: '📜' },
      { path: '/ops/policies', label: 'Regulatory Policies', icon: '⚖️' }
    ],
    'Field Agent': [
      { path: '/ops/field/tasks', label: 'Verification Tasks', icon: '📍' },
      { path: '/ops/field/map', label: 'Site Visit Map', icon: '🗺️' },
      { path: '/ops/field/history', label: 'Visit History', icon: '🕒' },
      { path: '/ops/field/sync', label: 'Offline Sync', icon: '🔄' }
    ],
    'Operations Manager': [
      { path: '/ops/dashboard', label: 'Team Overview', icon: '👥' },
      { path: '/ops/workflow', label: 'Workflow Designer', icon: '⚙️' },
      { path: '/ops/resource', label: 'Resource Load', icon: '🔋' },
      { path: '/ops/escalations', label: 'Critical Escallations', icon: '🚨' }
    ],
    'CXO': [
      { path: '/cxo/dashboard', label: 'Command Centre', icon: '🏢' },
      { path: '/cxo/risk', label: 'Risk & Fraud', icon: '🛡️' },
      { path: '/cxo/compliance', label: 'Compliance & Audit', icon: '⚖️' },
      { path: '/cxo/insights', label: 'Strategic Insights', icon: '💡' },
      { path: '/cxo/admin', label: 'Global Settings', icon: '⚙️' }
    ],
    'Compliance Officer': [
      { path: '/cxo/dashboard', label: 'Risk Dashboard', icon: '🏢' },
      { path: '/cxo/str', label: 'STR Reporting', icon: '🚩' },
      { path: '/cxo/compliance', label: 'Audit Explorer', icon: '⚖️' },
      { path: '/cxo/feed', label: 'Regulatory Feed', icon: '📰' }
    ]
  };

  const links = menuItems[role] || [];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ width: collapsed ? '80px' : '280px', transition: 'width 0.3s ease' }}>
      <div className="brand" style={{ padding: collapsed ? '0' : '0 10px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ fontSize: '24px', background: '#ef4444', padding: '8px', borderRadius: '10px', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}>🛡️</div>
        {!collapsed && (
          <div>
            <b style={{ display: 'block', fontSize: '18px', letterSpacing: '-0.5px' }}>KYC Shield</b>
            <span style={{ fontSize: '10px', opacity: 0.5, fontWeight: '700' }}>Enterprise KYC</span>
          </div>
        )}
      </div>

      <nav style={{ flex: 1, marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {links.map(link => (
          <NavLink 
            key={link.path} 
            to={link.path} 
            className={({ isActive }) => isActive ? 'active' : ''}
            style={{ 
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '12px 0' : '12px 15px'
            }}
          >
            <span style={{ fontSize: '20px' }}>{link.icon}</span>
            {!collapsed && <span style={{ marginLeft: '12px' }}>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', padding: '0 10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'grid', placeItems: 'center', fontWeight: 'bold', fontSize: '12px' }}>
              {role[0]}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{role} User</div>
              <Badge tone="purple" style={{ fontSize: '9px', padding: '2px 6px' }}>Verified</Badge>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="secondary" 
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: collapsed ? '100%' : '45px', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {collapsed ? '→' : '←'}
          </Button>
          {!collapsed && (
            <Button variant="secondary" onClick={logout} style={{ flex: 1, padding: '10px', background: '#ffffff', color: '#1e293b', fontWeight: 'bold' }}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
