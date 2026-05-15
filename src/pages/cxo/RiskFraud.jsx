import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, PageTitle, Badge, Button } from '../../components/UI';

const radarData = [
  { subject: 'Sanctions', A: 120, fullMark: 150 },
  { subject: 'PEP', A: 98, fullMark: 150 },
  { subject: 'Adverse Media', A: 86, fullMark: 150 },
  { subject: 'Duplicate ID', A: 99, fullMark: 150 },
  { subject: 'Doc Fraud', A: 85, fullMark: 150 },
  { subject: 'Geo Risk', A: 65, fullMark: 150 },
];

export default function RiskFraud() {
  const downloadEvidence = () => {
    const blob = new Blob([JSON.stringify({ alert: 'Suspicious Activity', details: radarData }, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'evidence_pack.txt';
    link.click();
  };

  return (
    <div>
      <PageTitle title="Risk & Fraud Sentinel" subtitle="Real-time monitoring of AML signals and suspicious patterns" />

      <div className="grid two">
        <Card style={{ padding: '25px', height: '450px' }}>
          <h4>AML Risk Signals (Aggregate)</h4>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis hide />
              <Radar name="Risk Index" dataKey="A" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.5} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid">
          <Card style={{ padding: '25px' }}>
            <h3>High Risk Escatations</h3>
            <div className="grid" style={{ marginTop: '15px' }}>
              {[
                { id: 'KYC-24003', customer: 'Vikram Iyer', signal: 'Sanctions Hit', risk: 'High' },
                { id: 'KYC-24005', customer: 'Manish Shah', signal: 'Geo-Distance Deviation', risk: 'EDD' }
              ].map(item => (
                <div key={item.id} className="card space" style={{ padding: '15px' }}>
                  <div>
                    <b>{item.customer}</b>
                    <div style={{ color: 'var(--danger)', fontSize: '12px' }}>{item.signal}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Badge tone={item.risk === 'High' ? 'danger' : 'purple'}>{item.risk}</Badge>
                    <Button variant="secondary" onClick={() => alert('Escalated')} style={{ fontSize: '12px' }}>Escalate</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ padding: '25px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px' }}>📦</div>
            <h4>Evidence Pack Generation</h4>
            <p className="muted" style={{ fontSize: '13px' }}>Download full investigation payload for regulatory submission</p>
            <Button onClick={downloadEvidence} style={{ marginTop: '15px' }}>Generate Evidence Pack</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
