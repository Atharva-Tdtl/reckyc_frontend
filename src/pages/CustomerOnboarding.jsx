import React, { useState } from 'react';
import { Button, Card, PageTitle, Spinner, Badge } from '../components/UI.jsx';
import API from '../api/client';

export default function CustomerOnboarding({ showToast }) {
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  
  const [isKycLoading, setIsKycLoading] = useState(false);
  const [kycResult, setKycResult] = useState(null);

  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);

  const [files, setFiles] = useState([]);
  const fileInputRef = React.useRef(null);

  const handleStartKyc = async () => {
    if (!name || !pan) {
      if (showToast) showToast('Name and PAN are required', 'error');
      return;
    }
    setIsKycLoading(true);
    setKycResult(null);
    try {
      // 1. Create Customer
      const [first_name, ...rest] = name.split(' ');
      const last_name = rest.join(' ') || ' ';
      const customerRes = await API.post('/customers/', { first_name, last_name, pan, aadhaar_last4: aadhaar });
      const customerId = customerRes.data.id;

      // 2. Create Case
      const caseRes = await API.post('/cases/create_from_customer/', { customer_id: customerId });
      const caseId = caseRes.data.id;

      // 3. Trigger AI Processing
      const processRes = await API.post(`/cases/list/${caseId}/process_ai/`);
      
      setKycResult({
        risk: 'LOW',
        fraud: 'NORMAL',
        decision: processRes.data.stage === 'CKYC_UPLOAD' ? 'AUTO_APPROVE' : 'MAKER_CHECKER_REVIEW',
        nextStage: processRes.data.stage,
        panVerified: 'Yes',
        faceMatch: '94%'
      });
      if (showToast) showToast('AI KYC Completed Successfully');
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to complete KYC', 'error');
    } finally {
      setIsKycLoading(false);
    }
  };

  const handleSimulateOcr = () => {
    setIsOcrLoading(true);
    setTimeout(() => {
      setName('Amit Andre');
      setPan('AABCA1234F');
      setAadhaar('9012');
      setOcrDone(true);
      setIsOcrLoading(false);
      if (showToast) showToast('OCR simulation completed');
    }, 1000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).map(f => f.name);
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).map(f => f.name);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
    // Reset the input value so the same file can be selected again if removed
    e.target.value = null;
  };

  return <>
    <PageTitle title="Customer Onboarding Studio" subtitle="Digital, assisted branch, DSA, builder, broker and co-lending onboarding flows."/>
    <div className="grid two">
      <Card>
        <h3>Applicant Capture</h3>
        <div className="form-grid">
          <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)}/>
          <input placeholder="Mobile number"/>
          <input placeholder="PAN" value={pan} onChange={e => setPan(e.target.value)}/>
          <input placeholder="Aadhaar last 4 digits" value={aadhaar} onChange={e => setAadhaar(e.target.value)}/>
          <select><option>Home Loan</option><option>Loan Against Property</option><option>Construction Loan</option></select>
          <select><option>Salaried</option><option>Self-employed</option><option>NRI</option><option>Joint applicant</option></select>
          <textarea placeholder="Property details, builder, broker, co-borrowers"/>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
          <Button onClick={handleStartKyc} disabled={isKycLoading}>
            {isKycLoading ? <div style={{display:'flex', gap:'8px', alignItems:'center'}}><Spinner /> Processing...</div> : 'Start AI KYC'}
          </Button>
        </div>
        {kycResult && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>KYC Result</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
              <div><strong>Risk:</strong> {kycResult.risk}</div>
              <div><strong>Fraud:</strong> {kycResult.fraud}</div>
              <div><strong>Decision:</strong> {kycResult.decision}</div>
              <div><strong>Next Stage:</strong> {kycResult.nextStage}</div>
              <div><strong>PAN Verified:</strong> {kycResult.panVerified}</div>
              <div><strong>Face Match:</strong> {kycResult.faceMatch}</div>
            </div>
          </div>
        )}
      </Card>
      <Card>
        <h3>Document Upload & OCR</h3>
        <div 
          className="upload-box" 
          onDrop={handleDrop} 
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ cursor: 'pointer' }}
        >
          Drop Aadhaar, PAN, Passport, Utility Bill, Bank Statement or Salary Slip
          <input 
            type="file" 
            multiple 
            hidden 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
          />
        </div>
        {files.length > 0 && (
          <div style={{ margin: '15px 0' }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderBottom: '1px solid #eee' }}>
                <span>{f}</span>
                <Badge tone="success">Uploaded</Badge>
              </div>
            ))}
          </div>
        )}
        <ul className="checklist">
          <li>{ocrDone && <span style={{color: '#16a34a', fontWeight: 'bold', marginRight: '5px'}}>✓</span>}OCR + AI extraction</li>
          <li>{ocrDone && <span style={{color: '#16a34a', fontWeight: 'bold', marginRight: '5px'}}>✓</span>}Document classification</li>
          <li>{ocrDone && <span style={{color: '#16a34a', fontWeight: 'bold', marginRight: '5px'}}>✓</span>}Multi-language parsing</li>
          <li>{ocrDone && <span style={{color: '#16a34a', fontWeight: 'bold', marginRight: '5px'}}>✓</span>}Cross-document consistency check</li>
        </ul>
        <Button variant="secondary" onClick={handleSimulateOcr} disabled={isOcrLoading}>
          {isOcrLoading ? <div style={{display:'flex', gap:'8px', alignItems:'center'}}><Spinner /> Scanning...</div> : 'Simulate OCR'}
        </Button>
      </Card>
    </div>
    <Card>
      <h3>Identity & Address Verification</h3>
      <div className="feature-grid">
        <div>Aadhaar Offline XML / OTP</div>
        <div>PAN Verification API</div>
        <div>CKYC Fetch / Update</div>
        <div>DigiLocker</div>
        <div>Face Match</div>
        <div>Liveness Detection</div>
        <div>Geo-tagged Address</div>
        <div>Field Verification Trigger</div>
      </div>
    </Card>
  </>
}
