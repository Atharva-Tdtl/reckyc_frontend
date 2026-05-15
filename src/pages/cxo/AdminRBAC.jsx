import React, { useState } from 'react';
import { Card, PageTitle, Badge, Button, Toast } from '../../components/UI';

export default function AdminRBAC() {
  const [permissions, setPermissions] = useState({
    'CXO': ['View Dashboard', 'Export Data', 'Admin Settings'],
    'Operations Manager': ['View Dashboard', 'Manage Cases', 'Export Data', 'Approve Cases'],
    'Compliance Officer': ['View Dashboard', 'Export Data', 'Admin Settings'],
    'Maker': ['Manage Cases'],
    'Checker': ['Manage Cases', 'Approve Cases'],
    'Field Agent': ['Manage Cases']
  });

  const roles = Object.keys(permissions);
  const perms = ['View Dashboard', 'Manage Cases', 'Export Data', 'Approve Cases', 'Admin Settings'];
  const [toast, setToast] = useState(null);

  const togglePermission = (role, perm) => {
    setPermissions(prev => {
      const current = prev[role];
      const next = current.includes(perm) ? current.filter(p => p !== perm) : [...current, perm];
      return { ...prev, [role]: next };
    });
  };

  return (
    <div>
      <PageTitle title="Admin & Security" subtitle="Configure Role-Based Access Control and system integrations" />

      <div className="grid two" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <Card style={{ padding: '25px' }}>
          <h4>Role × Permission Matrix</h4>
          <div className="table" style={{ marginTop: '20px' }}>
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  {perms.map(p => <th key={p} style={{ fontSize: '11px', textAlign: 'center' }}>{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {roles.map(role => (
                  <tr key={role}>
                    <td><b>{role}</b></td>
                    {perms.map(p => (
                      <td key={p} style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={permissions[role].includes(p)}
                          disabled={(role === 'CXO' || role === 'Compliance Officer') && p === 'Approve Cases'}
                          onChange={() => togglePermission(role, p)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button style={{ marginTop: '20px' }} onClick={() => setToast({ message: 'Permissions updated', type: 'success' })}>Save Changes</Button>
        </Card>

        <div className="grid">
          <Card style={{ padding: '25px' }}>
            <h4>Integration Config</h4>
            <div className="grid" style={{ gap: '15px', marginTop: '15px' }}>
              {['CKYC API', 'PAN Verification', 'DigiLocker', 'Aadhaar eKYC'].map(item => (
                <div key={item} className="role-switcher">
                  <div className="space">
                    <label>{item} Endpoint</label>
                    <Badge tone="success">Connected</Badge>
                  </div>
                  <input type="text" defaultValue="https://api.v2.external.com/verify" />
                </div>
              ))}
              <Button onClick={() => setToast({ message: 'Saved', type: 'success' })}>Save Integration</Button>
            </div>
          </Card>

          <Card style={{ padding: '25px' }}>
            <h4>Security Controls</h4>
            <div className="grid two" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
              {['RBAC', 'E2E Encryption', 'Consent Ledger', 'API Key Vault', 'PII Masking', 'Model Versioning'].map(ctrl => (
                <div key={ctrl} className="card space" style={{ padding: '10px', background: '#f8fafc', fontSize: '11px' }}>
                  <span>{ctrl}</span>
                  <Badge tone="success">ON</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
