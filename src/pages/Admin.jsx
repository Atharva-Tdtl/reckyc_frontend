import React, { useState } from 'react';
import { roles } from '../data/mockData.js';
import { Button, Card, PageTitle, Modal, Badge } from '../components/UI.jsx';

const allPermissions = ['View Dashboard', 'Manage Cases', 'Export Data', 'Approve Cases', 'Admin Settings'];

export default function Admin({ showToast }) {
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [permissions, setPermissions] = useState({});
  
  const [endpoints, setEndpoints] = useState({
    ckyc: '',
    pan: '',
    digilocker: '',
    aadhaar: ''
  });
  const [integrationSaved, setIntegrationSaved] = useState(false);

  const [securityControls, setSecurityControls] = useState({
    'RBAC': true,
    'End-to-end encryption': true,
    'Consent ledger': true,
    'API key vault': true,
    'PII masking': true,
    'Model versioning': true
  });

  const handleTogglePermission = (role, perm) => {
    const rolePerms = permissions[role] || [];
    const newPerms = rolePerms.includes(perm) 
      ? rolePerms.filter(p => p !== perm) 
      : [...rolePerms, perm];
    setPermissions({ ...permissions, [role]: newPerms });
  };

  const handleSaveMatrix = () => {
    if (showToast) showToast('RBAC matrix updated successfully');
    setMatrixOpen(false);
  };

  const handleSaveIntegration = () => {
    if (!endpoints.ckyc || !endpoints.pan || !endpoints.digilocker || !endpoints.aadhaar) {
      if (showToast) showToast('Please fill all endpoint inputs', 'error');
      return;
    }
    setIntegrationSaved(true);
    if (showToast) showToast('Integration config saved');
  };

  const toggleSecurityControl = (ctrl) => {
    setSecurityControls(prev => ({ ...prev, [ctrl]: !prev[ctrl] }));
  };

  return <>
    <PageTitle title="Admin, RBAC & Configuration" subtitle="Role-based access, integrations, notification templates, security controls and model governance."/>
    
    <div className="grid two">
      <Card>
        <h3>Roles & Permissions</h3>
        {roles.map(r => (
          <div className="permission" key={r} style={{ marginBottom: '10px' }}>
            <b>{r}</b>
            <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>
              {(permissions[r] || []).length > 0 ? permissions[r].join(', ') : 'Dashboard, cases, audit, workflow actions configured'}
            </span>
          </div>
        ))}
        <Button onClick={() => setMatrixOpen(true)}>Update Matrix</Button>
      </Card>
      
      <Card>
        <h3>Integration Configuration</h3>
        <div className="form-grid">
          <div>
            <input placeholder="CKYC API endpoint" value={endpoints.ckyc} onChange={e => setEndpoints({...endpoints, ckyc: e.target.value})} style={{ width: '100%', marginBottom: '5px' }}/>
            {integrationSaved && endpoints.ckyc && <Badge tone="success">Connected</Badge>}
          </div>
          <div>
            <input placeholder="PAN verification endpoint" value={endpoints.pan} onChange={e => setEndpoints({...endpoints, pan: e.target.value})} style={{ width: '100%', marginBottom: '5px' }}/>
            {integrationSaved && endpoints.pan && <Badge tone="success">Connected</Badge>}
          </div>
          <div>
            <input placeholder="DigiLocker client ID" value={endpoints.digilocker} onChange={e => setEndpoints({...endpoints, digilocker: e.target.value})} style={{ width: '100%', marginBottom: '5px' }}/>
            {integrationSaved && endpoints.digilocker && <Badge tone="success">Connected</Badge>}
          </div>
          <div>
            <input placeholder="Aadhaar eKYC mode" value={endpoints.aadhaar} onChange={e => setEndpoints({...endpoints, aadhaar: e.target.value})} style={{ width: '100%', marginBottom: '5px' }}/>
            {integrationSaved && endpoints.aadhaar && <Badge tone="success">Connected</Badge>}
          </div>
          <select><option>Encryption: AES-256</option></select>
          <select><option>Audit: append-only</option></select>
        </div>
        <div style={{ marginTop: '15px' }}>
          <Button onClick={handleSaveIntegration}>Save Integration</Button>
        </div>
      </Card>
    </div>
    
    <Card>
      <h3>Security Controls</h3>
      <div className="feature-grid">
        {Object.entries(securityControls).map(([ctrl, isActive]) => (
          <div key={ctrl} onClick={() => toggleSecurityControl(ctrl)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {ctrl}
            <Badge tone={isActive ? 'success' : 'danger'}>{isActive ? 'ON' : 'OFF'}</Badge>
          </div>
        ))}
      </div>
    </Card>

    <Modal open={matrixOpen} onClose={() => setMatrixOpen(false)} title="RBAC Matrix">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '2px solid #eee' }}>Role</th>
              {allPermissions.map(p => <th key={p} style={{ padding: '8px', borderBottom: '2px solid #eee', fontSize: '12px' }}>{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>{r}</td>
                {allPermissions.map(p => (
                  <td key={p} style={{ padding: '8px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={(permissions[r] || []).includes(p)} 
                      onChange={() => handleTogglePermission(r, p)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleSaveMatrix}>Save Changes</Button>
      </div>
    </Modal>
  </>
}
