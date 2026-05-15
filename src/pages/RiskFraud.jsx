import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Badge, Button, Card, PageTitle, Modal, Spinner } from '../components/UI.jsx';

const radar = [
  { k: 'Sanctions', v: 94 },
  { k: 'PEP', v: 81 },
  { k: 'Adverse Media', v: 76 },
  { k: 'Duplicate ID', v: 88 },
  { k: 'Doc Fraud', v: 71 },
  { k: 'Geo Risk', v: 68 }
];

const signalTooltips = {
  'Sanctions': 'Sanctions screening against UN, OFAC, and local lists.',
  'PEP': 'Politically Exposed Person — cross-checked against FATF and domestic PEP lists',
  'Adverse Media': 'Negative news and media coverage screening.',
  'Duplicate ID': 'Detects identity reuse or similar identifiers across applications.',
  'Doc Fraud': 'Analysis of document metadata, fonts, and forgery indicators.',
  'Geo Risk': 'Risk score based on high-risk geographic locations.'
};

export default function RiskFraud({ showToast }) {
  const [eddModalOpen, setEddModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState(null);

  const confirmEdd = () => {
    if (showToast) showToast('Case escalated to EDD queue');
    setEddModalOpen(false);
  };

  const handleGeneratePack = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const data = {
        alertId: "FA-9012",
        caseId: "KYC-24005",
        severity: "High",
        type: "Duplicate Identity",
        details: "Same Aadhaar hash and different PAN observed across two loan applications. Address variation and image similarity score require checker escalation.",
        amlRiskScore: 82,
        radarScores: radar.reduce((acc, curr) => ({...acc, [curr.k]: curr.v}), {})
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'evidence_pack_KYC-24005.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const handleAxisClick = (payload) => {
    if (payload && payload.value) {
      setSelectedSignal(payload.value);
    }
  };

  return <>
    <PageTitle title="AML Risk & Fraud Intelligence" subtitle="Explainable risk scoring, sanctions/PEP/adverse media, anomaly detection and EDD recommendations."/>
    <div className="grid two">
      <Card>
        <h3>Risk Signal Radar</h3>
        <ResponsiveContainer width="100%" height={310}>
          <RadarChart data={radar}>
            <PolarGrid/>
            <PolarAngleAxis dataKey="k" onClick={handleAxisClick} tick={{ style: { cursor: 'pointer', fill: '#007bff' } }} />
            <Radar dataKey="v" fillOpacity={0.35}/>
          </RadarChart>
        </ResponsiveContainer>
        {selectedSignal && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
            <strong>{selectedSignal}:</strong> {signalTooltips[selectedSignal]}
          </div>
        )}
      </Card>
      <Card>
        <h3>Fraud Alert Detail</h3>
        <p><Badge tone="danger">High Severity</Badge></p>
        <h2>Potential duplicate identity detected</h2>
        <p>Same Aadhaar hash and different PAN observed across two loan applications. Address variation and image similarity score require checker escalation.</p>
        <div className="score-box"><span>AML Risk Score</span><b>82/100</b></div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <Button onClick={() => setEddModalOpen(true)}>Escalate to EDD</Button>
          <Button variant="secondary" onClick={handleGeneratePack} disabled={generating}>
            {generating ? <div style={{display:'flex', gap:'8px', alignItems:'center'}}><Spinner /> Generating...</div> : 'Generate Evidence Pack'}
          </Button>
        </div>
      </Card>
    </div>
    <Card>
      <h3>Detection Capabilities</h3>
      <div className="feature-grid">
        <div>Fake document detection</div>
        <div>Identity duplication</div>
        <div>Suspicious document velocity</div>
        <div>Selfie-document face mismatch</div>
        <div>NRI passport/address exception</div>
        <div>Profile change re-KYC trigger</div>
      </div>
    </Card>

    <Modal open={eddModalOpen} onClose={() => setEddModalOpen(false)} title="Confirm EDD Escalation">
      <p>Confirm escalation of this case to Enhanced Due Diligence?</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button variant="secondary" onClick={() => setEddModalOpen(false)}>Cancel</Button>
        <Button onClick={confirmEdd}>Confirm</Button>
      </div>
    </Modal>
  </>
}
