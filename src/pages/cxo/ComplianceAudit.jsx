import React, { useState } from 'react';
import { Card, PageTitle, Badge, Button, Modal } from '../../components/UI';
import { auditLogs } from '../../data/mockData';

export default function ComplianceAudit() {
  const [selectedAudit, setSelectedAudit] = useState(null);

  const downloadReport = () => {
    const report = auditLogs.map(l => `[${l.time}] ${l.actor}: ${l.action} | Result: ${l.result}`).join('\n');
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compliance_audit_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
  };

  return (
    <div>
      <div className="space" style={{ marginBottom: '20px' }}>
        <PageTitle title="Compliance & Audit" subtitle="Immutable audit trails and regulatory compliance dashboard" />
        <Button onClick={downloadReport}>Download Compliance Report</Button>
      </div>

      <div className="grid three" style={{ marginBottom: '25px' }}>
        {[
          { label: 'RBI KYC Compliance', value: '100%', tone: 'success' },
          { label: 'PMLA/AML Policy', value: '98.2%', tone: 'success' },
          { label: 'DPDP Readiness', value: '96.7%', tone: 'warning' }
        ].map(c => (
          <Card key={c.label} style={{ padding: '20px', cursor: 'pointer' }} onClick={() => alert(`Details for ${c.label}`)}>
            <div className="muted" style={{ fontSize: '13px' }}>{c.label}</div>
            <div className="space" style={{ marginTop: '10px' }}>
              <h2 style={{ margin: 0 }}>{c.value}</h2>
              <Badge tone={c.tone}>PASSED</Badge>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Case ID</th>
                <th>Result</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, i) => (
                <tr key={i}>
                  <td className="muted">{log.time}</td>
                  <td><b>{log.actor}</b></td>
                  <td>{log.action}</td>
                  <td><Badge>{log.caseId}</Badge></td>
                  <td><span style={{ fontSize: '13px' }}>{log.result}</span></td>
                  <td>
                    <button className="linkbtn" onClick={() => setSelectedAudit(log)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!selectedAudit} onClose={() => setSelectedAudit(null)} title="Audit Entry Details">
        {selectedAudit && (
          <div className="grid">
            <div className="card" style={{ background: '#f8fafc' }}>
              <div className="space"><span>Timestamp</span><b>{selectedAudit.time}</b></div>
              <div className="space"><span>Actor</span><b>{selectedAudit.actor}</b></div>
              <div className="space"><span>Action Type</span><b>{selectedAudit.action}</b></div>
              <div className="space"><span>Reference ID</span><b>{selectedAudit.caseId}</b></div>
            </div>
            <div>
              <label>Full Execution Log</label>
              <pre style={{ background: '#0f172a', color: '#10b981', padding: '15px', borderRadius: '12px', fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify({
                  status: "success",
                  message: selectedAudit.result,
                  metadata: {
                    ip: "192.168.1.42",
                    session_id: "sess_9x2kL0",
                    version: "v2.4.1"
                  }
                }, null, 2)}
              </pre>
            </div>
            <Button onClick={() => { navigator.clipboard.writeText(selectedAudit.caseId); alert('Case ID copied'); }}>Copy Case ID</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
