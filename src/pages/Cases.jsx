import React, { useMemo, useState, useEffect } from 'react';
import API from '../api/client';
import { Badge, Button, Card, PageTitle, Modal } from '../components/UI.jsx';

export default function Cases({ role, showToast }) {
  const [q, setQ] = useState('');
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignMode, setAssignMode] = useState(false);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [agents, setAgents] = useState([]);
  const [assignAgent, setAssignAgent] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await API.get('/cases/list/');
      setCases(res.data);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to load cases', 'error');
    }
  };

  const rows = useMemo(() => cases.filter(c => {
    return JSON.stringify(c).toLowerCase().includes(q.toLowerCase());
  }), [q, cases]);

  const handleExport = () => {
    const headers = ['Case ID', 'Customer', 'Loan Type', 'Segment', 'Risk', 'Stage', 'Owner', 'Flags'];
    const csvRows = rows.map(r => [r.id, r.customer, r.type, r.segment, r.risk, r.stage, r.owner, r.flags].join(','));
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kyc_queue_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Queue exported successfully');
  };

  const handleAssignClick = () => {
    if (assignMode) {
      if (assignAgent && selectedCases.size > 0) {
        showToast(`${selectedCases.size} case(s) assigned to ${assignAgent}`);
      }
      setAssignMode(false);
      setSelectedCases(new Set());
      setAssignAgent('');
    } else {
      setAssignMode(true);
    }
  };

  const toggleCaseSelection = (id) => {
    const newSet = new Set(selectedCases);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCases(newSet);
  };

  return <>
    <PageTitle title="KYC Case Management" subtitle="Maker-checker queues for new onboarding, Re-KYC, deficiency handling, EDD, CKYC upload and field verification."/>
    <Card>
      <div className="toolbar">
        <input placeholder="Search case/customer/status" value={q} onChange={e=>setQ(e.target.value)}/>
        
        {assignMode && (
          <select value={assignAgent} onChange={e => setAssignAgent(e.target.value)}>
            <option value="">Select Agent...</option>
            {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        )}
        <Button onClick={handleAssignClick}>
          {assignMode ? 'Confirm Assign' : 'Assign Selected'}
        </Button>
        <Button variant="secondary" onClick={handleExport}>Export Queue</Button>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              {assignMode && <th>Select</th>}
              <th>Case ID</th><th>Customer</th><th>Stage</th><th>Priority</th><th>Assigned To</th><th>Created</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c=><tr key={c.id}>
              {assignMode && <td><input type="checkbox" checked={selectedCases.has(c.id)} onChange={() => toggleCaseSelection(c.id)} /></td>}
              <td>{c.id}</td><td>{c.customer_name}</td><td><Badge tone={c.stage==='CKYC_UPLOAD'?'success':c.stage==='REJECTED'?'danger':'warning'}>{c.stage}</Badge></td><td>{c.priority}</td><td>{c.assigned_to || 'Unassigned'}</td><td>{new Date(c.created_at).toLocaleDateString()}</td>
              <td><button className="linkbtn" onClick={() => setSelectedCase(c)}>Open</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>
    <Card><h3>Case Detail UX Components</h3><div className="feature-grid"><div>360° customer profile</div><div>Document confidence panel</div><div>Cross-document mismatch view</div><div>AML explainability timeline</div><div>Maker-checker decision panel</div><div>CKYC evidence pack</div></div></Card>

    <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={`Case Details: ${selectedCase?.id}`}>
      {selectedCase && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div><strong>Customer:</strong> {selectedCase.customer_name}</div>
            <div><strong>Stage:</strong> <Badge tone={selectedCase.stage==='CKYC_UPLOAD'?'success':selectedCase.stage==='REJECTED'?'danger':'warning'}>{selectedCase.stage}</Badge></div>
            <div><strong>Priority:</strong> {selectedCase.priority}</div>
            <div><strong>Assigned To:</strong> {selectedCase.assigned_to || 'None'}</div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{marginBottom: '10px'}}>AI Agent Traces (Audit Trail)</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
              {selectedCase.traces?.length > 0 ? selectedCase.traces.map((t, i) => (
                <div key={i} style={{ marginBottom: '15px', fontSize: '13px', borderBottom: i < selectedCase.traces.length - 1 ? '1px solid #f9f9f9' : 'none', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{t.agent_name}</strong>
                    <Badge tone={t.status === 'SUCCESS' || t.status === 'FINALIZED' ? 'success' : 'warning'}>{t.status}</Badge>
                  </div>
                  <div style={{ color: '#666', marginTop: '4px' }}><em>" {t.thought} "</em></div>
                  <div style={{ marginTop: '4px' }}>{t.log}</div>
                </div>
              )) : <div style={{color: '#999'}}>No AI traces available for this case.</div>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <Button variant="secondary" onClick={() => setSelectedCase(null)}>Close</Button>
            {role === 'Maker' && <Button onClick={() => { showToast('Submitted for Review'); setSelectedCase(null); }}>Submit for Review</Button>}
            {role === 'Checker' && (
              <>
                <Button variant="secondary" onClick={() => { showToast('Case Rejected'); setSelectedCase(null); }}>Reject</Button>
                <Button onClick={() => { showToast('Case Approved'); setSelectedCase(null); }}>Approve</Button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  </>
}

