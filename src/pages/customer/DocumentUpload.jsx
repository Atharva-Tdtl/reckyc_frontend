import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, PageTitle, Badge, Progress, Toast } from '../../components/UI';

export default function DocumentUpload() {
  const [uploads, setUploads] = useState({});
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const docs = [
    { id: 'aadhaar', name: 'Aadhaar Card', desc: 'Front and Back side', required: true, digilocker: true },
    { id: 'pan', name: 'PAN Card', desc: 'Front side only', required: true, digilocker: true },
    { id: 'salary', name: 'Salary Slip', desc: 'Last 3 months slips', required: true },
    { id: 'bank', name: 'Bank Statement', desc: 'Last 6 months statement', required: true },
    { id: 'utility', name: 'Utility Bill', desc: 'Electricity or Water bill', required: true },
    { id: 'property', name: 'Property Documents', desc: 'Sale deed or Agreement', required: true },
    { id: 'passport', name: 'Passport', desc: 'Required for NRI', required: false }
  ];

  const handleUpload = (id, file) => {
    setUploads(prev => ({ ...prev, [id]: file }));
  };

  const handleDigiLocker = (name) => {
    setToast({ message: `DigiLocker fetch simulated — ${name} pre-filled`, type: 'info' });
    setUploads(prev => ({ ...prev, [name.toLowerCase().split(' ')[0]]: { name: 'digilocker_verified.pdf', size: '150KB' } }));
  };

  const requiredUploaded = docs.filter(d => d.required).every(d => uploads[d.id]);
  const progressCount = docs.filter(d => uploads[d.id]).length;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <PageTitle title="Document Upload" subtitle="Upload clear copies of the following documents to continue" />

      <div className="grid two">
        {docs.map(doc => (
          <Card key={doc.id} style={{ padding: '20px', border: uploads[doc.id] ? '2px solid var(--success)' : '1px solid var(--line)' }}>
            <div className="space" style={{ marginBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>{doc.name}</h4>
              <Badge tone={doc.required ? 'danger' : 'neutral'}>{doc.required ? 'Required' : 'Optional'}</Badge>
            </div>
            <p className="muted" style={{ fontSize: '13px', marginBottom: '15px' }}>{doc.desc}</p>
            
            <div 
              className="upload-box" 
              style={{ 
                padding: '20px', 
                fontSize: '14px', 
                cursor: 'pointer',
                background: uploads[doc.id] ? '#f0fdf4' : '#eff6ff',
                borderColor: uploads[doc.id] ? 'var(--success)' : '#93c5fd'
              }}
              onClick={() => document.getElementById(`input-${doc.id}`).click()}
            >
              {uploads[doc.id] ? (
                <div>
                  <div style={{ color: 'var(--success)' }}>✓ {uploads[doc.id].name}</div>
                  <Badge tone="success">Uploaded</Badge>
                </div>
              ) : (
                "Drop file or click to browse"
              )}
              <input 
                id={`input-${doc.id}`} 
                type="file" 
                hidden 
                onChange={(e) => handleUpload(doc.id, e.target.files[0])} 
              />
            </div>

            {doc.digilocker && !uploads[doc.id] && (
              <Button 
                variant="secondary" 
                style={{ width: '100%', marginTop: '10px', fontSize: '12px' }}
                onClick={() => handleDigiLocker(doc.name)}
              >
                Fetch from DigiLocker
              </Button>
            )}
          </Card>
        ))}
      </div>

      <div className="card" style={{ marginTop: '30px', padding: '20px', position: 'sticky', bottom: '20px', boxShadow: '0 -10px 20px rgba(0,0,0,0.05)' }}>
        <div className="space">
          <div>
            <b>Progress: {progressCount} of {docs.length} documents</b>
            <div style={{ width: '200px', marginTop: '5px' }}>
              <Progress value={(progressCount / docs.length) * 100} color="var(--primary)" />
            </div>
          </div>
          <Button 
            disabled={!requiredUploaded} 
            onClick={() => navigate('/app/selfie')}
            style={{ padding: '15px 40px' }}
          >
            Continue
          </Button>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
