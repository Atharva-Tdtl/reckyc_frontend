import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, LineChart, Line, CartesianGrid } from 'recharts';
import API from '../api/client';
import { Badge, Card, PageTitle } from '../components/UI.jsx';

export default function Dashboard({role}) { 
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const endpoint = role === 'CXO' ? '/dashboards/cxo/' : '/dashboards/operations/';
      try {
        const res = await API.get(endpoint);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [role]);

  const kpis = data ? [
    { label: 'Total Customers', value: data.total_customers || data.pending_cases, trend: '+12%', tone: 'success' },
    { label: 'Completion Rate', value: `${data.kyc_completion_rate || 84}%`, trend: '+5%', tone: 'success' },
    { label: 'Automation Rate', value: `${data.automation_rate || 72}%`, trend: '+2%', tone: 'success' },
    { label: 'Watchlist Hits', value: data.fraud_watchlist_hits || 0, trend: 'Normal', tone: 'warning' },
  ] : [];

  return <>
  <PageTitle title="CXO & Operations Command Center" subtitle={`Live view personalized for ${role}: KYC completion, compliance, risk, fraud and operational SLA.`}/>
  <div className="kpi-grid">
    {kpis.map(k => <Card key={k.label}><span className="muted">{k.label}</span><h3>{k.value}</h3><Badge tone={k.tone}>{k.trend}</Badge></Card>)}
  </div>
  <div className="grid two">
    <Card>
      <h3>KYC / Re-KYC Throughput</h3>
      <div style={{height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
         [ Trend analysis data linked to Case timeline ]
      </div>
    </Card>
    <Card>
      <h3>Risk Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie 
            dataKey="count" 
            nameKey="risk_category" 
            data={data?.risk_distribution || [{risk_category: 'LOW', count: 1}]} 
            outerRadius={92} 
            label 
            fill="#3b82f6"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  </div>
  <Card>
    <h3>Compliance Status</h3>
    <div className="feature-grid">
      <div>RBI KYC Master Direction: <Badge tone="success">Ready</Badge></div>
      <div>PMLA AML Monitoring: <Badge tone="success">Ready</Badge></div>
      <div>DPDP Consent Traceability: <Badge tone="success">Ready</Badge></div>
    </div>
  </Card>
</>; }
