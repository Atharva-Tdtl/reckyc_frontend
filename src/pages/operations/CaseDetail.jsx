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
  const [activeTab, setActiveTab] = useState('Documents');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await API.get(`/cases/list/${id}/`);
        setCaseData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
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
      setToast({ message: `Case ${id} marked as ${modalType.toUpperCase()} in the database.`, type: 'success' });
      setShowModal(false);
      setTimeout(() => navigate('/ops/cases'), 1500);
    } catch (err) {
      setToast({ message: "Failed to update case status.", type: "danger" });
    }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><Spinner size="large"/></div>;
  if (!caseData) return <div style={{padding: '100px', textAlign: 'center'}}>Case not found</div>;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
      {/* Header Bar */}
      <div className="space" style={{ marginBottom: '30px', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
            <Badge tone="neutral" style={{ fontSize: '11px', fontWeight: '800' }}>CASE #{id}</Badge>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ fontSize: '14px', color: '#64748b' }}>Submitted on {new Date(caseData.created_at).toLocaleDateString()}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a' }}>
            {caseData.customer_name}
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
           <Badge tone="warning" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '800' }}>
             {caseData.stage?.replace('_', ' ') || 'MAKER REVIEW'}
           </Badge>
        </div>
      </div>

      <div className="grid two" style={{ gridTemplateColumns: '380px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Column: Customer 360 */}
        <div className="grid" style={{ gap: '24px' }}>
          <Card style={{ padding: '32px', borderRadius: '24px', background: 'white', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Avatar name={caseData.customer_name} size="96px" />
              <div style={{ marginTop: '16px' }}>
                <Badge tone="info" style={{ borderRadius: '8px' }}>{caseData.customer_type}</Badge>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                <div className="muted" style={{ fontSize: '11px', fontWeight: '800', marginBottom: '10px', letterSpacing: '0.05em' }}>PRIMARY IDENTITY</div>
                <div className="grid" style={{ gap: '12px' }}>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">🆔 PAN</span>
                    <b style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>{caseData.pan || 'N/A'}</b>
                  </div>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">👤 Aadhaar</span>
                    <b style={{ fontFamily: 'monospace' }}>•••• {caseData.aadhaar_last4 || '0000'}</b>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 8px' }}>
                <div className="muted" style={{ fontSize: '11px', fontWeight: '800', marginBottom: '15px', letterSpacing: '0.05em' }}>CONTACT INFORMATION</div>
                <div className="grid" style={{ gap: '12px' }}>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">📱 Mobile</span>
                    <b>+91 {caseData.mobile}</b>
                  </div>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">📧 Email</span>
                    <b style={{ color: '#2563eb' }}>{caseData.email}</b>
                  </div>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid #f1f5f9' }} />

              <div style={{ padding: '0 8px' }}>
                <div className="muted" style={{ fontSize: '11px', fontWeight: '800', marginBottom: '15px', letterSpacing: '0.05em' }}>LOAN SPECIFICATIONS</div>
                <div className="grid" style={{ gap: '12px' }}>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">🏠 Type</span>
                    <b>{caseData.loan_type}</b>
                  </div>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">💰 Amount</span>
                    <b style={{ fontSize: '16px' }}>₹ 35,00,000</b>
                  </div>
                  <div className="space" style={{ fontSize: '14px' }}>
                    <span className="muted">📅 Income</span>
                    <b>₹ 80k/mo</b>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Property Collateral</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '10px', display: 'grid', placeItems: 'center', fontSize: '20px' }}>📍</div>
               <div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Sunshine Heights, Unit 402</div>
                  <div className="muted" style={{ fontSize: '12px' }}>Mumbai, Maharashtra</div>
               </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Insights & Decisioning */}
        <div className="grid" style={{ gap: '24px' }}>
          <Card style={{ padding: 0, borderRadius: '24px', overflow: 'hidden', background: 'white', border: '1px solid #f1f5f9' }}>
            {/* Industry Level Tabs */}
            <div style={{ background: '#f8fafc', padding: '0 30px', display: 'flex', gap: '40px', borderBottom: '1px solid #f1f5f9' }}>
              {['Documents', 'AI Analysis', 'Audit Trail'].map(tab => (
                <button 
                  key={tab}
                  style={{ 
                    background: 'none', border: 0, padding: '20px 0', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '700', color: activeTab === tab ? '#2563eb' : '#64748b',
                    borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                    transition: '0.2s'
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: '32px' }}>
              {activeTab === 'Documents' && (
                <div className="grid" style={{ gap: '16px' }}>
                  {[
                    { name: 'PAN Card', score: 98.2, status: 'VERIFIED' },
                    { name: 'Aadhaar Card', score: 94.5, status: 'VERIFIED' },
                    { name: 'Salary Slips (3M)', score: 91.0, status: 'MANUAL_REVIEW' }
                  ].map(doc => (
                    <div key={doc.name} className="space" style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', display: 'grid', placeItems: 'center', fontSize: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>📄</div>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{doc.name}</div>
                          <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>OCR Confidence: {doc.score}%</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <Badge tone={doc.status === 'VERIFIED' ? 'success' : 'warning'} style={{ fontSize: '10px' }}>{doc.status}</Badge>
                        <Button variant="secondary" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}>Preview</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'AI Analysis' && (
                <div className="grid" style={{ gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: '800', marginBottom: '8px' }}>AI RISK ASSESSMENT</div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#15803d' }}>{caseData.risk_category}</div>
                      <div style={{ fontSize: '13px', color: '#16a34a', marginTop: '4px' }}>Confidence: High (97.4%)</div>
                    </div>
                    <div style={{ background: '#eff6ff', padding: '24px', borderRadius: '20px', border: '1px solid #dbeafe' }}>
                      <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '800', marginBottom: '8px' }}>AUTO-DECISION</div>
                      <div style={{ fontSize: '28px', fontWeight: '800', color: '#1d4ed8' }}>ELIGIBLE</div>
                      <div style={{ fontSize: '13px', color: '#2563eb', marginTop: '4px' }}>Policy: NHB-Standard-V2</div>
                    </div>
                  </div>

                  <div className="grid" style={{ gap: '16px' }}>
                    <h4 style={{ fontSize: '14px', color: '#64748b' }}>AGENT ORCHESTRATION LOGS</h4>
                    {caseData.traces?.map((trace, i) => (
                      <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
                        <div className="space" style={{ marginBottom: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ padding: '6px 12px', background: 'white', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: '#1e293b', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                               {trace.agent_name?.toUpperCase()}
                            </div>
                          </div>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#334155', marginBottom: '12px' }}>
                          "{trace.thought}"
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                           <span style={{ fontSize: '12px', color: '#10b981' }}>✓ {trace.log}</span>
                        </div>
                      </div>
                    )) || <div className="muted">No agents assigned yet.</div>}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Premium Command Bar - Role & Status Based */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', background: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9', backdropFilter: 'blur(10px)', position: 'sticky', bottom: '20px' }}>
            
            {/* Maker Flow */}
            {role === 'Maker' && (
              <>
                {caseData.stage === 'INTAKE' ? (
                  <Button style={{ background: '#2563eb', padding: '14px 48px', borderRadius: '14px', fontSize: '15px', fontWeight: '800' }} onClick={() => handleAction('start_maker')}>START MAKER REVIEW</Button>
                ) : caseData.stage === 'MAKER_REVIEW' ? (
                  <>
                    <Button variant="secondary" onClick={() => handleAction('returned')} style={{ padding: '14px 24px', borderRadius: '14px' }}>Request Documents</Button>
                    <Button style={{ background: '#2563eb', padding: '14px 48px', borderRadius: '14px', fontSize: '15px', fontWeight: '800' }} onClick={() => handleAction('escalated')}>SUBMIT TO CHECKER</Button>
                  </>
                ) : null}
              </>
            )}

            {/* Checker Flow */}
            {(role === 'Checker' || role === 'CXO') && (
              <>
                {caseData.stage === 'MAKER_REVIEW' ? (
                  <Button style={{ background: '#7c3aed', padding: '14px 48px', borderRadius: '14px', fontSize: '15px', fontWeight: '800' }} onClick={() => handleAction('start_checker')}>START CHECKER REVIEW</Button>
                ) : caseData.stage === 'CHECKER_REVIEW' ? (
                  <>
                    <Button variant="secondary" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '14px 24px', borderRadius: '14px' }} onClick={() => handleAction('returned')}>Return to Maker</Button>
                    <Button style={{ background: '#10b981', padding: '14px 48px', borderRadius: '14px', fontSize: '15px', fontWeight: '800', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }} onClick={() => handleAction('approved')}>FINAL APPROVE</Button>
                  </>
                ) : null}
              </>
            )}

            {/* If the case is in a later stage, show a informative message instead */}
            {(caseData.stage === 'APPROVED' || (role === 'Maker' && caseData.stage === 'CHECKER_REVIEW')) && (
              <div style={{ color: '#64748b', fontSize: '14px', fontStyle: 'italic', padding: '10px' }}>
                ✓ This case is currently being processed at the <b>{caseData.stage.replace('_', ' ')}</b> stage. No further actions required.
              </div>
            )}

          </div>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm Compliance Action">
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>
            You are about to <b>{modalType.toUpperCase()}</b> Case #{id}. This action will be timestamped and linked to your officer ID in the immutable audit log.
          </p>
          <div style={{ marginTop: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', display: 'block', marginBottom: '8px' }}>DECISION RATIONALE</label>
            <textarea 
              placeholder="Provide a mandatory reason for this action..." 
              style={{ width: '100%', minHeight: '120px', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} style={{ flex: 1, borderRadius: '12px' }}>Cancel</Button>
            <Button onClick={confirmAction} style={{ flex: 2, background: '#0f172a', borderRadius: '12px' }}>Confirm Decision</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
