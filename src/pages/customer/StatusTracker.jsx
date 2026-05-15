import React, { useState, useEffect } from 'react';
import API from '../../api/client';
import { Card, PageTitle, Badge, Button, Spinner } from '../../components/UI';

export default function StatusTracker() {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const caseId = localStorage.getItem('active_case_id');
      if (!caseId) { setLoading(false); return; }
      try {
        const res = await API.get(`/cases/list/${caseId}/`);
        setCaseData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const getStepStatus = (stepName) => {
    if (!caseData) return 'pending';
    const stages = ['INTAKE', 'OCR_EXTRACTION', 'IDENTITY_VERIF', 'ADDRESS_VERIF', 'AML_RISK', 'COMPLIANCE_REVIEW', 'CKYC_UPLOAD', 'COMPLETED'];
    const currentIdx = stages.indexOf(caseData.stage);
    const stepIdx = stages.indexOf(stepName);
    if (stepIdx < currentIdx) return 'complete';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
  };

  const steps = [
    { label: 'Application submitted', stage: 'INTAKE' },
    { label: 'Documents uploaded', stage: 'OCR_EXTRACTION' },
    { label: 'AI verification complete', stage: 'AML_RISK' },
    { label: 'Under review', stage: 'COMPLIANCE_REVIEW' },
    { label: 'CKYC update', stage: 'CKYC_UPLOAD' },
    { label: 'Approved', stage: 'COMPLETED' },
  ];

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><Spinner size="large"/></div>;

    const handleDownload = () => {
      alert("Generating Acknowledgement Letter PDF...\n\nYour official KYC receipt (KYC-" + (caseData?.id || '001') + ") is being prepared for download.");
    };

    const handleAddDocs = () => {
      navigate('/app/documents');
    };

    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div className="grid two" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Left Side: Timeline */}
          <Card style={{ padding: '40px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '40px', fontFamily: 'Outfit' }}>Application Timeline</h2>
            <div style={{ display: 'grid', gap: '0', position: 'relative' }}>
              {steps.map((step, i) => {
                const status = getStepStatus(step.stage);
                return (
                  <div key={i} style={{ display: 'flex', gap: '24px', paddingBottom: '40px', position: 'relative' }}>
                    {i !== steps.length - 1 && (
                      <div style={{ 
                        position: 'absolute', left: '11px', top: '24px', bottom: '-24px', 
                        width: '2px', background: status === 'complete' ? '#10b981' : '#f1f5f9' 
                      }}></div>
                    )}
                    
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', zIndex: 1,
                      background: status === 'complete' ? '#10b981' : (status === 'active' ? '#2563eb' : 'white'),
                      border: status === 'pending' ? '2px solid #f1f5f9' : 'none',
                      display: 'grid', placeItems: 'center'
                    }}>
                      {status === 'complete' && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                    </div>

                    <div>
                      <div style={{ 
                        fontWeight: '700', fontSize: '18px', 
                        color: status === 'pending' ? '#94a3b8' : '#0f172a' 
                      }}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Right Side: Actions & Activity */}
          <div className="grid" style={{ gap: '30px' }}>
            
            <Card style={{ padding: '30px', borderRadius: '24px' }}>
              <div className="space" style={{ marginBottom: '20px' }}>
                <div>
                  <div className="muted" style={{ fontSize: '13px' }}>Case ID</div>
                  <h2 style={{ color: '#2563eb', margin: 0, fontSize: '24px', fontFamily: 'monospace' }}>
                     {caseData ? `KYC-${caseData.id}` : 'N/A'}
                  </h2>
                </div>
                <Badge tone={caseData?.stage === 'COMPLETED' ? 'success' : 'warning'} style={{ padding: '8px 16px', borderRadius: '12px' }}>
                  {caseData?.stage || 'PENDING'}
                </Badge>
              </div>
              
              <div className="grid" style={{ gap: '12px' }}>
                <Button 
                  onClick={handleDownload}
                  style={{ width: '100%', padding: '16px', borderRadius: '14px' }}
                >
                  Download Acknowledgement Letter
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleAddDocs}
                  style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#f8fafc' }}
                >
                  Upload Additional Document
                </Button>
              </div>
            </Card>

          <Card style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px', fontFamily: 'Outfit' }}>Recent Activity</h3>
            <div className="grid" style={{ gap: '20px' }}>
              {caseData?.traces?.slice(-3).map((t, i) => (
                <div key={i} className="space" style={{ fontSize: '15px' }}>
                  <span>{t.log}</span>
                  <span className="muted" style={{ fontSize: '13px' }}>{new Date(t.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              )) || <div className="muted">No recent activity</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
