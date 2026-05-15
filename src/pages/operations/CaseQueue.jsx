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
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const view = queryParams.get('view') || 'queue';

  useEffect(() => {
    fetchCases(page, search);
  }, [page, location.search]);

  const fetchCases = async (pageNum, query = '') => {
    setLoading(true);
    try {
      // Determine which stage to filter by based on role and view
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

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchCases(1, search);
    }
  };

  const getRiskColor = (risk) => {
    switch(risk?.toUpperCase()) {
      case 'HIGH': return { bg: '#fee2e2', text: '#991b1b' };
      case 'MEDIUM': return { bg: '#fef3c7', text: '#92400e' };
      case 'LOW': return { bg: '#dcfce7', text: '#166534' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const getStageBadge = (stage) => {
    const s = stage?.toUpperCase();
    if (s === 'COMPLETED' || s === 'APPROVED') return <Badge tone="success">APPROVED</Badge>;
    if (s === 'REJECTED') return <Badge tone="danger">REJECTED</Badge>;
    if (s?.includes('REVIEW') || s?.includes('CHECKER')) return <Badge tone="warning">IN REVIEW</Badge>;
    return <Badge tone="neutral">{s || 'PENDING'}</Badge>;
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <PageTitle title="Case Management" subtitle={`Managing ${count.toLocaleString()} active KYC applications`} />

      <div className="card toolbar" style={{ padding: '20px', marginBottom: '24px', display: 'flex', gap: '15px', alignItems: 'center', background: 'white', borderRadius: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search by Case ID or Customer Name... (Press Enter)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            style={{ width: '100%', paddingLeft: '45px', borderRadius: '14px', border: '1px solid #e2e8f0' }}
          />
          <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
        </div>
        <select style={{ width: '180px', borderRadius: '14px', border: '1px solid #e2e8f0' }}><option>All Risk Levels</option></select>
        <Button onClick={() => fetchCases(1, search)} style={{ borderRadius: '14px' }}>Filter</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
              <tr>
                {['CASE ID', 'CUSTOMER', 'LOAN TYPE', 'SEGMENT', 'RISK', 'STAGE', 'PRIORITY', 'CREATED', 'ACTION'].map(h => (
                  <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 [1,2,3,4,5].map(i => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td colSpan="9" style={{ padding: '20px 24px' }}>
                      <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                    </td>
                  </tr>
                 ))
              ) : cases.map(c => {
                const rColor = getRiskColor(c.risk);
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: '0.2s' }} className="table-row-hover">
                    <td style={{ padding: '18px 24px', fontWeight: '700', color: '#2563eb', fontSize: '14px' }}>{c.id}</td>
                    <td style={{ padding: '18px 24px', fontWeight: '600', color: '#0f172a' }}>{c.customer}</td>
                    <td style={{ padding: '18px 24px', color: '#64748b', fontSize: '13px' }}>{c.type}</td>
                    <td style={{ padding: '18px 24px' }}><Badge>{c.segment}</Badge></td>
                    <td style={{ padding: '18px 24px' }}>
                      <span style={{ background: rColor.bg, color: rColor.text, padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>
                        {c.risk}
                      </span>
                    </td>
                    <td style={{ padding: '18px 24px' }}>{getStageBadge(c.status)}</td>
                    <td style={{ padding: '18px 24px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1,2,3].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= c.priority ? '#ef4444' : '#e2e8f0' }}></div>)}
                      </div>
                    </td>
                    <td style={{ padding: '18px 24px', color: '#94a3b8', fontSize: '13px' }}>{c.date}</td>
                    <td style={{ padding: '18px 24px' }}>
                      <button className="btn secondary" style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '10px' }} onClick={() => navigate(`/ops/cases/${c.realId}`)}>View Details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Industry Level Pagination Footer */}
        <div style={{ padding: '20px 24px', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Showing <b>{(page - 1) * 20 + 1}</b> to <b>{Math.min(page * 20, count)}</b> of <b>{count.toLocaleString()}</b> cases
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ borderRadius: '10px', padding: '8px 16px' }}>Previous</Button>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0 10px' }}>
              <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{page}</span>
              <span className="muted">/</span>
              <span className="muted">{Math.ceil(count / 20)}</span>
            </div>
            <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={page * 20 >= count} style={{ borderRadius: '10px', padding: '8px 16px' }}>Next</Button>
          </div>
        </div>
      </Card>
      <style>{`
        .table-row-hover:hover { background: #f8fafc; cursor: pointer; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
