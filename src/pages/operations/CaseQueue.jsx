import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, PageTitle, Badge, Button, Spinner } from '../../components/UI';
import API from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function CaseQueue() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, pending: 0, critical: 0, tat: '0m' });
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get('view') || 'queue';

  useEffect(() => {
    fetchCases(page, search);
    fetchStats();
  }, [page, location.search]);

  const fetchStats = async () => {
    try {
      const res = await API.get('/cases/list/stats/');
      setStats({
        total: res.data.total_cases,
        pending: res.data.pending_reviews,
        critical: Math.floor(res.data.total_cases * 0.12), // Simulated critical
        tat: '4.2m'
      });
    } catch (err) { console.error(err); }
  };

  const fetchCases = async (pageNum, query = '') => {
    setLoading(true);
    try {
      let stageFilter = '';
      if (role === 'Maker') {
        stageFilter = view === 'queue' ? 'INTAKE' : 'MAKER_REVIEW';
      } else if (role === 'Checker') {
        stageFilter = view === 'queue' ? 'MAKER_REVIEW' : 'CHECKER_REVIEW';
      }

      const res = await API.get(`/cases/list/?page=${pageNum}&search=${query}&stage=${stageFilter}`);
      const mappedCases = res.data.results.map(c => ({
        id: `KYC-${c.id}`,
        realId: c.id,
        customer: c.customer_name,
        type: c.loan_type,
        segment: c.customer_type,
        risk: c.risk_category,
        status: c.stage,
        priority: c.priority,
        date: new Date(c.created_at).toLocaleDateString()
      }));
      setCases(mappedCases);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyle = (risk) => {
    switch(risk?.toUpperCase()) {
      case 'HIGH': return { color: '#ef4444', border: '4px solid #ef4444' };
      case 'MEDIUM': return { color: '#f59e0b', border: '4px solid #f59e0b' };
      case 'LOW': return { color: '#10b981', border: '4px solid #10b981' };
      default: return { color: '#64748b', border: '4px solid #e2e8f0' };
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 20px' }}>
      <PageTitle title="Operations Desk" subtitle={`${view === 'queue' ? 'Global Queue' : 'My Active Reviews'} | Role: ${role}`} />

      {/* KPI Pulse Row */}
      <div className="grid four" style={{ gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'Total Volume', val: stats.total.toLocaleString(), icon: '📊', color: '#6366f1' },
          { label: 'Pending Reviews', val: stats.pending.toLocaleString(), icon: '🕒', color: '#f59e0b' },
          { label: 'Critical / High Risk', val: stats.critical.toLocaleString(), icon: '🚨', color: '#ef4444' },
          { label: 'Avg. Decision Time', val: stats.tat, icon: '⚡', color: '#10b981' }
        ].map((k, i) => (
          <Card key={i} style={{ padding: '20px', borderRadius: '20px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div className="space">
              <span style={{ fontSize: '24px' }}>{k.icon}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>{k.label}</div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: k.color }}>{k.val}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="card toolbar" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '15px', alignItems: 'center', background: 'white', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search Intelligence Database..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCases(1, search)}
            style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
          />
          <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
        </div>
        <Button onClick={() => fetchCases(1, search)} style={{ borderRadius: '14px', padding: '12px 24px', background: '#1e293b' }}>Apply Filters</Button>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}><Spinner /></div>
        ) : cases.map(c => {
          const style = getRiskStyle(c.risk);
          return (
            <div 
              key={c.id} 
              onClick={() => navigate(`/ops/cases/${c.realId}`)}
              style={{ 
                background: 'white', padding: '20px 30px', borderRadius: '20px', 
                display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 1fr', 
                alignItems: 'center', cursor: 'pointer', transition: '0.2s',
                borderLeft: style.border, boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>CASE ID</div>
                <div style={{ fontWeight: '800', color: '#2563eb' }}>{c.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>CUSTOMER ENTITY</div>
                <div style={{ fontWeight: '700', color: '#1e293b' }}>{c.customer}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>PRODUCT</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{c.type}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>RISK SCORE</div>
                <div style={{ color: style.color, fontWeight: '900', fontSize: '13px' }}>● {c.risk}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748b' }}>CURRENT STAGE</div>
                <Badge tone={c.status.includes('REVIEW') ? 'warning' : 'neutral'}>{c.status}</Badge>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Button variant="secondary" style={{ borderRadius: '12px', fontSize: '12px' }}>Open Case</Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', paddingBottom: '50px' }}>
        <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ borderRadius: '12px' }}>← Previous</Button>
        <div style={{ background: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '800', color: '#1e293b', border: '1px solid #e2e8f0' }}>
          Page {page} of {Math.ceil(count / 20)}
        </div>
        <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page * 20 >= count} style={{ borderRadius: '12px' }}>Next →</Button>
      </div>
    </div>
  );
}
