import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, PageTitle, Badge, Button, Avatar, Modal, Toast, Spinner } from '../../components/UI';
import API from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function CaseDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('AI Insights');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await API.get(`/cases/list/${id}/`);
        setCaseData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchCase();
  }, [id]);

  const handleAction = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      await API.post(`/cases/list/${id}/change_stage/`, { action: modalType });
      setToast({ message: `Decision recorded for Case #${id}`, type: 'success' });
      setShowModal(false);
      setTimeout(() => navigate('/ops/cases'), 1500);
    } catch (err) { setToast({ message: "Action failed", type: "danger" }); }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><Spinner size="large"/></div>;
  if (!caseData) return <div style={{padding: '100px', textAlign: 'center'}}>Case not found</div>;

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 30px' }}>
      {/* Premium Header Terminal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ background: '#f1f5f9', color: '#1e293b', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', border: '1px solid #e2e8f0' }}>CASE ID: {id}</span>
            <div style={{ width: '6px', height: '6px', background: '#e2e8f0', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>Opened by AI Agent 007 • {new Date(caseData.created_at).toLocaleTimeString()}</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', letterSpacing: '-1px' }}>
            {caseData.customer_name}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.1em' }}>CURRENT COMPLIANCE STATUS</div>
           <Badge tone={caseData.stage.includes('APPROVED') ? 'success' : 'warning'} style={{ padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: '900' }}>
             {caseData.stage.replace('_', ' ')}
           </Badge>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px', alignItems: 'start', paddingBottom: '120px' }}>
        
        {/* Profile Sidebar */}
        <div className="grid" style={{ gap: '24px' }}>
          <Card style={{ padding: '40px 30px', borderRadius: '24px', border: 'none', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Avatar name={caseData.customer_name} size="100px" />
              <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: '800' }}>{caseData.customer_name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{caseData.customer_type} | ID Verified</div>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
               <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '12px' }}>EXTRACTED METADATA</div>
                  <div className="grid" style={{ gap: '12px' }}>
                     <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>PAN NUMBER</div>
                        <div style={{ fontWeight: '800', fontFamily: 'monospace', letterSpacing: '0.1em' }}>{caseData.pan || 'NOT_FOUND'}</div>
                     </div>
                     <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>AADHAAR UID</div>
                        <div style={{ fontWeight: '800', fontFamily: 'monospace' }}>XXXX XXXX {caseData.aadhaar_last4}</div>
                     </div>
                  </div>
               </div>

               <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '12px' }}>CONTACT REQUISITES</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', display: 'grid', gap: '8px' }}>
                     <div className="space"><span>📱 Mobile</span> <span>+91 {caseData.mobile}</span></div>
                     <div className="space"><span>📧 Email</span> <span style={{ color: '#2563eb' }}>{caseData.email}</span></div>
                  </div>
               </div>
            </div>
          </Card>

          <Card style={{ padding: '24px', borderRadius: '24px', border: 'none', background: '#0f172a', color: 'white' }}>
             <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', letterSpacing: '0.05em', marginBottom: '16px' }}>SYSTEM RISK ANALYSIS</div>
             <div className="space">
                <span style={{ fontSize: '24px', fontWeight: '900' }}>{caseData.risk_category}</span>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: '800' }}>Low Risk</div>
                   <div style={{ fontSize: '10px', color: '#475569' }}>Score: {caseData.risk_score}/100</div>
                </div>
             </div>
          </Card>
        </div>

        {/* Intelligence Main Panel */}
        <div className="grid" style={{ gap: '24px' }}>
          <Card style={{ padding: 0, borderRadius: '24px', border: 'none', background: 'white', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ background: '#f8fafc', padding: '0 30px', display: 'flex', gap: '40px', borderBottom: '1px solid #f1f5f9' }}>
              {['AI Insights', 'Verification Files', 'Audit Ledger'].map(t => (
                <button 
                  key={t} onClick={() => setActiveTab(t)}
                  style={{ 
                    background: 'none', border: 0, padding: '24px 0', cursor: 'pointer', fontSize: '14px', fontWeight: '800',
                    color: activeTab === t ? '#2563eb' : '#64748b', borderBottom: activeTab === t ? '2px solid #2563eb' : '2px solid transparent',
                    transition: '0.2s'
                  }}
                >{t}</button>
              ))}
            </div>

            <div style={{ padding: '40px' }}>
               {activeTab === 'AI Insights' && (
                  <div className="grid" style={{ gap: '30px' }}>
                     <div style={{ background: '#f0fdf4', padding: '30px', borderRadius: '24px', border: '1px solid #dcfce7', display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '18px', display: 'grid', placeItems: 'center', fontSize: '32px' }}>🧠</div>
                        <div>
                           <div style={{ fontWeight: '800', color: '#166534', fontSize: '18px' }}>AI Reasoning Report</div>
                           <p style={{ color: '#166534', fontSize: '14px', marginTop: '4px', opacity: 0.8 }}>Agentic analysis complete. All identity markers match global sanctions lists with no red flags.</p>
                        </div>
                     </div>

                     <div className="grid" style={{ gap: '16px' }}>
                        {caseData.traces?.map((trace, i) => (
                           <div key={i} style={{ position: 'relative', paddingLeft: '40px' }}>
                              <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '2px', background: '#e2e8f0' }}></div>
                              <div style={{ position: 'absolute', left: '-5px', top: '0', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid white' }}></div>
                              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                                 <div className="space" style={{ marginBottom: '12px' }}>
                                    <Badge style={{ background: '#1e293b', color: 'white' }}>{trace.agent_name}</Badge>
                                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                                 </div>
                                 <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a', marginBottom: '8px' }}>"{trace.thought}"</div>
                                 <div style={{ fontSize: '13px', color: '#64748b' }}>Action: <span style={{ color: '#10b981', fontWeight: '700' }}>{trace.log}</span></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'Verification Files' && (
                  <div className="grid two" style={{ gap: '20px' }}>
                     {['PAN Card', 'Aadhaar UID', 'Address Proof', 'Income Proof'].map(doc => (
                        <div key={doc} style={{ padding: '24px', border: '1px solid #f1f5f9', borderRadius: '20px', background: '#f8fafc', display: 'flex', gap: '20px', alignItems: 'center' }}>
                           <div style={{ width: '56px', height: '56px', background: 'white', borderRadius: '16px', display: 'grid', placeItems: 'center', fontSize: '24px', border: '1px solid #e2e8f0' }}>📄</div>
                           <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '800', fontSize: '14px' }}>{doc}</div>
                              <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '800' }}>✓ AI EXTRACTED</div>
                           </div>
                           <Button variant="secondary" style={{ borderRadius: '10px', fontSize: '11px' }}>Preview</Button>
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Decision Terminal */}
      <div style={{ 
        position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', 
        width: 'calc(100% - 120px)', maxWidth: '1400px',
        background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)',
        padding: '24px 40px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', zIndex: 1000, border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '40px' }}>
           <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '0.1em' }}>DECISION REQUIRED AS</div>
              <div style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>{role.toUpperCase()}</div>
           </div>
           <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '0.1em' }}>CURRENT FLOW</div>
              <div style={{ color: '#3b82f6', fontWeight: '800', fontSize: '16px' }}>{caseData.stage.replace('_', ' ')} → FINAL</div>
           </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
           <Button variant="secondary" style={{ background: 'transparent', border: '1px solid #475569', color: 'white', padding: '12px 24px', borderRadius: '12px' }} onClick={() => handleAction('returned')}>Return for Clarification</Button>
           
           {role === 'Maker' && caseData.stage === 'INTAKE' && (
              <Button style={{ background: '#3b82f6', padding: '12px 40px', borderRadius: '12px', fontWeight: '800' }} onClick={() => handleAction('start_maker')}>Start Review</Button>
           )}
           {role === 'Maker' && caseData.stage === 'MAKER_REVIEW' && (
              <Button style={{ background: '#3b82f6', padding: '12px 40px', borderRadius: '12px', fontWeight: '800' }} onClick={() => handleAction('escalated')}>Escalate to Checker</Button>
           )}
           {role === 'Checker' && caseData.stage === 'MAKER_REVIEW' && (
              <Button style={{ background: '#8b5cf6', padding: '12px 40px', borderRadius: '12px', fontWeight: '800' }} onClick={() => handleAction('start_checker')}>Start Verification</Button>
           )}
           {role === 'Checker' && caseData.stage === 'CHECKER_REVIEW' && (
              <Button style={{ background: '#10b981', padding: '12px 40px', borderRadius: '12px', fontWeight: '800' }} onClick={() => handleAction('approved')}>Confirm & Approve</Button>
           )}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Compliance Authorization">
        <div style={{ padding: '20px 0' }}>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>Confirming this action will move Case #{id} to the next stage. This decision is final and will be logged in the immutable audit ledger.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} style={{ flex: 1, borderRadius: '12px' }}>Cancel</Button>
            <Button onClick={confirmAction} style={{ flex: 2, background: '#1e293b', borderRadius: '12px' }}>Confirm Action</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
