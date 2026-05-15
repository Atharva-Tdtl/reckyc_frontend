import React, { useState } from 'react';
import { auditLogs } from '../data/mockData.js';
import { Button, Card, PageTitle, Modal } from '../components/UI.jsx';

const complianceChecks = {
  'RBI KYC': ['Video KYC (V-CIP) infrastructure compliance', 'Aadhaar offline XML / OTP consent logging', 'OVD (Officially Valid Document) validation', 'Record maintenance for 5 years'],
  'PMLA / AML': ['Sanctions and PEP screening', 'Suspicious Transaction Report (STR) readiness', 'Enhanced Due Diligence (EDD) for high-risk profiles', 'Beneficial Ownership tracking'],
  'DPDP': ['Explicit data processing consent', 'Purpose limitation controls', 'Data minimization and retention policies', 'Right to erasure processing workflows']
};

export default function Compliance({ showToast }) {
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);

  const downloadReport = () => {
    let reportContent = "COMPLIANCE AUDIT REPORT\n========================\n\n";
    auditLogs.forEach(l => {
      reportContent += `Time: ${l.time}\nActor: ${l.actor}\nAction: ${l.action}\nCase ID: ${l.caseId}\nResult: ${l.result}\n------------------------\n`;
    });
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compliance_audit_report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (showToast) showToast('Audit report downloaded successfully');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    if (showToast) showToast(`Copied ${text} to clipboard`);
  };

  return <>
    <PageTitle title="Compliance & Audit Console" subtitle="Regulator-ready traceability across RBI KYC Master Directions, NHB, PMLA, DPDP and CKYC obligations."/>
    
    <div className="grid three">
      <Card>
        <div onClick={() => setSelectedFramework('RBI KYC')} style={{ cursor: 'pointer' }}>
          <h3>RBI KYC</h3>
          <b className="big">100%</b>
          <p>Policy-mapped controls</p>
        </div>
      </Card>
      <Card>
        <div onClick={() => setSelectedFramework('PMLA / AML')} style={{ cursor: 'pointer' }}>
          <h3>PMLA / AML</h3>
          <b className="big">98.2%</b>
          <p>Screening coverage</p>
        </div>
      </Card>
      <Card>
        <div onClick={() => setSelectedFramework('DPDP')} style={{ cursor: 'pointer' }}>
          <h3>DPDP</h3>
          <b className="big">96.7%</b>
          <p>Consent and purpose limitation</p>
        </div>
      </Card>
    </div>

    <Card>
      <div className="space">
        <h3>Tamper-Proof Audit Trail</h3>
        <Button variant="secondary" onClick={downloadReport}>Download Report</Button>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Time</th><th>Actor</th><th>Action</th><th>Case</th><th>Result</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((l, i) => (
              <tr key={i}>
                <td>{l.time}</td>
                <td>{l.actor}</td>
                <td>{l.action}</td>
                <td>{l.caseId}</td>
                <td>{l.result}</td>
                <td><button className="linkbtn" onClick={() => setSelectedAudit(l)}>Details</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    <Modal open={!!selectedAudit} onClose={() => setSelectedAudit(null)} title="Audit Log Details">
      {selectedAudit && (
        <div>
          <p><strong>Time:</strong> {selectedAudit.time}</p>
          <p><strong>Actor:</strong> {selectedAudit.actor}</p>
          <p><strong>Action:</strong> {selectedAudit.action}</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <strong>Case ID:</strong> {selectedAudit.caseId}
            <Button variant="secondary" onClick={() => handleCopy(selectedAudit.caseId)} style={{ padding: '2px 8px', fontSize: '12px' }}>Copy</Button>
          </p>
          <p><strong>Result:</strong> {selectedAudit.result}</p>
        </div>
      )}
    </Modal>

    <Modal open={!!selectedFramework} onClose={() => setSelectedFramework(null)} title={`${selectedFramework} Controls`}>
      {selectedFramework && (
        <ul style={{ paddingLeft: '20px' }}>
          {complianceChecks[selectedFramework].map((check, idx) => (
            <li key={idx} style={{ marginBottom: '10px' }}>
              <span style={{ color: '#16a34a', marginRight: '8px', fontWeight: 'bold' }}>✓</span> {check}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  </>
}
