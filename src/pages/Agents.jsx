import React, { useState } from 'react';
import { agents as initialAgents } from '../data/mockData.js';
import { Badge, Card, PageTitle, Progress, Button, Spinner } from '../components/UI.jsx';

function AgentCard({ agent }) {
  const [status, setStatus] = useState(agent.status);
  const [expanded, setExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const togglePause = () => {
    setStatus(status === 'Active' ? 'Paused' : 'Active');
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setLastRun('just now');
    }, 1500);
  };

  return (
    <Card>
      <div onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <div className="space">
          <h3>{agent.name}</h3>
          <Badge tone={status === 'Active' ? 'success' : 'warning'}>{status}</Badge>
        </div>
        
        {expanded ? <p>{agent.description}</p> : <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.description}</p>}
        
        <div className="metric-row"><span>Accuracy</span><b>{agent.accuracy}%</b></div>
        <Progress value={agent.accuracy}/>
        <div className="metric-row"><span>Load</span><b>{agent.load}%</b></div>
        <Progress value={agent.load}/>
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button variant="secondary" onClick={togglePause}>
          {status === 'Active' ? 'Pause' : 'Resume'}
        </Button>
        <Button onClick={handleRun} disabled={isRunning}>
          {isRunning ? <div style={{display:'flex', gap:'8px', alignItems:'center'}}><Spinner /></div> : 'Run Now'}
        </Button>
      </div>
      {lastRun && !isRunning && <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>Last run: {lastRun}</div>}
    </Card>
  );
}

export default function Agents({ showToast }) {
  return (
    <>
      <PageTitle title="Agentic AI Hub" subtitle="Multi-agent control plane for intake, OCR, document understanding, identity, address, AML, fraud, audit and communications."/>
      <div className="agent-grid">
        {initialAgents.map(a => <AgentCard key={a.name} agent={a} />)}
      </div>
    </>
  );
}
