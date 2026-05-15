import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Card, PageTitle, Badge, Button, Spinner } from '../../components/UI';
import API from '../../api/client';
import { monthlyTrend } from '../../data/mockData';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export default function CommandCenter() {
  const [data, setData] = useState({ kpi: [], risk: [], alerts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/cases/list/stats/');
      const stats = res.data;
      
      setData({
        kpi: [
          { label: 'Total KYC Volume', value: stats.total_cases.toLocaleString(), trend: '+12.5%', tone: 'success', sub: 'Processed since launch' },
          { label: 'Pending Maker/Checker', value: stats.pending_reviews.toLocaleString(), trend: '-5%', tone: 'warning', sub: 'Active in workflow' },
          { label: 'Avg. Decision Time', value: '4.2m', trend: '-18%', tone: 'success', sub: 'vs 2.4h (Manual)' },
          { label: 'STP Rate (Auto)', value: '68.4%', trend: '+8.2%', tone: 'success', sub: 'Straight-Through-Process' }
        ],
        risk: Object.keys(stats.risks).map(key => ({
          name: key,
          value: stats.risks[key]
        })),
        alerts: [
          { id: '105001', name: 'Rakesh Gupta', risk: 'HIGH', reason: 'PAN-Aadhaar Name Mismatch' },
          { id: '104982', name: 'Kiran Dua', risk: 'MEDIUM', reason: 'PEP Match Found' },
          { id: '104877', name: 'Amit Shah', risk: 'HIGH', reason: 'Suspicious Document Pattern' }
        ]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><Spinner size="large"/></div>;

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <div className="space" style={{ marginBottom: '30px' }}>
        <PageTitle title="CXO Command Centre" subtitle="Enterprise Governance & AI Decisioning Oversight" />
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={refreshData} style={{ borderRadius: '12px' }}>Refresh Intel</Button>
          <Button style={{ background: '#1e293b', borderRadius: '12px' }}>Download Board Report</Button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="kpi-grid" style={{ gap: '20px' }}>
        {data.kpi.map((kpi, i) => (
          <Card key={i} style={{ padding: '24px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: '20px' }}>
            <div className="space">
              <div className="muted" style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
              <Badge tone={kpi.tone}>{kpi.trend}</Badge>
            </div>
            <h2 style={{ fontSize: '32px', margin: '10px 0', fontWeight: '800', color: '#1e293b' }}>{kpi.value}</h2>
            <div className="muted" style={{ fontSize: '11px' }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '30px' }}>
        {/* Main Throughput Chart */}
        <Card style={{ padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div className="space" style={{ marginBottom: '20px' }}>
            <div>
              <h4 style={{ margin: 0 }}>SLA & Efficiency Analysis</h4>
              <div className="muted" style={{ fontSize: '12px' }}>Weekly processing throughput vs TAT (Turnaround Time)</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
               <Badge tone="success">98.2% In-SLA</Badge>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorOn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="onboarded" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorOn)" />
                <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Breakdown */}
        <Card style={{ padding: '30px', borderRadius: '24px' }}>
          <h4 style={{ marginBottom: '25px' }}>Risk Exposure Portfolio</h4>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.risk} innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                  {data.risk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '20px' }}>
             {data.risk.map((r, i) => (
               <div key={i} className="space" style={{ padding: '8px 0', borderBottom: i < data.risk.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                 <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                   <span style={{ fontSize: '13px', fontWeight: '500' }}>{r.name} Risk</span>
                 </div>
                 <b style={{ fontSize: '14px' }}>{((r.value / 100000) * 100).toFixed(1)}%</b>
               </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Critical Alerts & Fraud Alerts */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '30px' }}>
         <Card style={{ padding: '25px', borderRadius: '24px' }}>
            <h4 style={{ marginBottom: '15px' }}>Critical AI Alerts</h4>
            <div className="grid" style={{ gap: '12px' }}>
               {data.alerts.map(alert => (
                 <div key={alert.id} className="space" style={{ background: '#fff1f2', padding: '12px 16px', borderRadius: '12px', border: '1px solid #ffe4e6' }}>
                   <div>
                     <div style={{ fontWeight: '700', fontSize: '13px', color: '#991b1b' }}>Case #{alert.id}: {alert.name}</div>
                     <div style={{ fontSize: '11px', color: '#b91c1c' }}>{alert.reason}</div>
                   </div>
                   <Badge tone="danger">{alert.risk}</Badge>
                 </div>
               ))}
            </div>
         </Card>

         <Card style={{ padding: '30px', borderRadius: '24px', background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
            <h4 style={{ color: 'white', marginBottom: '25px' }}>System Health & Compliance</h4>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px' }}>
               <div>
                 <div className="space" style={{ marginBottom: '10px' }}>
                   <span style={{ fontSize: '13px', opacity: 0.8 }}>Regulatory Compliance</span>
                   <b style={{ color: '#10b981' }}>99.9%</b>
                 </div>
                 <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: '99.9%', height: '100%', background: '#10b981' }}></div>
                 </div>
               </div>
               
               <div>
                 <div className="space" style={{ marginBottom: '10px' }}>
                   <span style={{ fontSize: '13px', opacity: 0.8 }}>AI Confidence Score</span>
                   <b style={{ color: '#6366f1' }}>98.4%</b>
                 </div>
                 <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: '98.4%', height: '100%', background: '#6366f1' }}></div>
                 </div>
               </div>

               <div style={{ marginTop: 'auto' }}>
                 <Button style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '14px' }}>
                   View Full Compliance Audit
                 </Button>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
