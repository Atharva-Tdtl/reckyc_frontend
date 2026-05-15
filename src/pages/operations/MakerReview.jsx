import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, PageTitle, Badge, Button, Toast, Spinner } from '../../components/UI';
import API from '../../api/client';

export default function MakerReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

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

  const handleAction = async (type) => {
    const actionMap = {
      'sent back': 'returned',
      'submitted to checker': 'escalated'
    };
    try {
      await API.post(`/cases/list/${id}/change_stage/`, { action: actionMap[type] });
      setToast({ message: `Case ${id} ${type} successfully`, type: 'success' });
      setTimeout(() => navigate('/ops/cases'), 1500);
    } catch (err) {
      setToast({ message: "Failed to update case.", type: "danger" });
    }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><Spinner size="large"/></div>;
  if (!caseData) return <div style={{padding: '100px', textAlign: 'center'}}>Case not found</div>;

  const fields = [
    { label: 'Full Name', value: caseData.customer_name, match: true },
    { label: 'PAN Number', value: caseData.pan || 'N/A', match: true },
    { label: 'Date of Birth', value: '15/08/1992', match: true },
    { label: 'Father\'s Name', value: 'S. ' + caseData.customer_name.split(' ')[0], match: true },
    { label: 'Address', value: 'Sunshine Heights, Mumbai', match: true }
  ];

  return (
    <div>
      <PageTitle title={`Maker Review: ${id}`} subtitle="Focused verification of extracted document fields" />

      <div className="grid two">
        <Card style={{ padding: 0, height: '600px', overflow: 'hidden', background: '#334155' }}>
          <div style={{ color: 'white', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
            <span>PAN_CARD_FRONT.JPG</span>
            <span>Zoom 100%</span>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', height: 'calc(100% - 50px)', background: '#1e293b' }}>
            <div style={{ width: '80%', height: '240px', background: '#f8fafc', borderRadius: '8px', padding: '20px', color: '#1e293b', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '10px' }}>INCOME TAX DEPARTMENT</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '20px' }}>{caseData.pan || 'N/A'}</div>
              <div style={{ marginTop: '20px' }}>{caseData.customer_name?.toUpperCase()}</div>
              <div style={{ fontSize: '12px' }}>15/08/1992</div>
            </div>
          </div>
        </Card>

        <div className="grid">
          <Card style={{ padding: '25px' }}>
            <h3>Extracted Fields</h3>
            <div className="grid" style={{ gap: '10px', marginTop: '20px' }}>
              {fields.map(field => (
                <div key={field.label} className="space" style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '12px' }}>
                  <div>
                    <div className="muted" style={{ fontSize: '11px' }}>{field.label}</div>
                    <div style={{ fontWeight: 'bold' }}>{field.value}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="linkbtn" style={{ background: field.match ? '#dcfce7' : '#fee2e2', color: field.match ? '#166534' : '#991b1b' }}>
                      {field.match ? '✓' : '✗'}
                    </button>
                    <button className="linkbtn" style={{ background: '#f1f5f9', color: '#64748b' }}>📝</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <label>Reviewer Comments</label>
              <textarea placeholder="Any observations during manual verification?" style={{ width: '100%', marginTop: '10px' }} />
            </div>
          </Card>

          <Card style={{ padding: '20px', display: 'flex', gap: '15px' }}>
            <Button variant="secondary" onClick={() => handleAction('sent back')} style={{ flex: 1 }}>Send Back to Customer</Button>
            <Button onClick={() => handleAction('submitted to checker')} style={{ flex: 1 }}>Submit to Checker</Button>
          </Card>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
