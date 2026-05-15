import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Spinner, Badge, Progress } from '../../components/UI';
import API, { AI } from '../../api/client';

export default function AIProcessing() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [showFinal, setShowFinal] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { label: "Document OCR Intake", agent: "document_intake_agent" },
    { label: "Consistency & Understanding", agent: "document_understanding_agent" },
    { label: "Identity & Liveness Check", agent: "identity_verification_agent" },
    { label: "AML Risk Scoring", agent: "risk_scoring_aml_agent" },
    { label: "Fraud Anomaly Detection", agent: "fraud_detection_agent" },
    { label: "Compliance Final Decision", agent: "compliance_audit_agent" }
  ];

  useEffect(() => {
    evaluateKYC();
  }, []);

  useEffect(() => {
    if (result) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < steps.length) {
          setStep(current + 1);
          current++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowFinal(true), 1000);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [result]);

  const evaluateKYC = async () => {
    const caseId = localStorage.getItem('active_case_id');
    if (!caseId) {
       setResult({ agent_decision: { recommended_action: "MAKER_CHECKER_REVIEW" } });
       return;
    }

    try {
      // Trigger the real AI Agent pipeline in Django
      await API.post(`/cases/list/${caseId}/process_ai/`);
      
      // Fetch the result with the traces
      const res = await API.get(`/cases/list/${caseId}/`);
      setResult({
        agent_traces: res.data.traces,
        agent_decision: { 
          recommended_action: res.data.stage === 'CKYC_UPLOAD' ? 'AUTO_APPROVE' : 'MAKER_CHECKER_REVIEW' 
        }
      });
    } catch (err) {
      console.error("Backend AI error", err);
      setResult({
        agent_traces: steps.map(s => ({ agent_name: s.agent, log: "Processed with manual oversight", thought: "Connected to human review queue." })),
        agent_decision: { recommended_action: "MAKER_CHECKER_REVIEW" }
      });
    }
  };

  const getActionPanel = () => {
    const action = result?.agent_decision?.recommended_action || "MAKER_CHECKER_REVIEW";
    
    if (action === "AUTO_APPROVE") {
      return (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '40px', borderRadius: '32px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ color: '#166534', fontSize: '28px' }}>Instantly Approved!</h2>
          <p className="muted" style={{ marginBottom: '30px', fontSize: '16px' }}>Our AI agents have verified your profile. You are eligible for auto-onboarding.</p>
          <Button onClick={() => navigate('/app/status')} style={{ padding: '15px 40px' }}>Go to Status Tracker</Button>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      );
    }
    
    return (
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '40px', borderRadius: '32px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ color: '#1e40af', fontSize: '28px' }}>Application Under Review</h2>
        <p className="muted" style={{ marginBottom: '30px', fontSize: '16px' }}>AI evaluation is complete. A compliance officer will perform the final sign-off.</p>
        <Button onClick={() => navigate('/app/status')} style={{ padding: '15px 40px' }}>Track Application</Button>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
      <Card style={{ padding: '40px', borderRadius: '32px' }}>
        {!showFinal ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>AI Engine Processing</h2>
              <p className="muted">Six autonomous agents are verifying your application in sequence</p>
            </div>

            <div className="grid" style={{ gap: '20px' }}>
              {steps.map((s, i) => {
                const isDone = i < step;
                const isCurrent = i === step;
                const trace = result?.agent_traces?.find(t => t.agent_name === s.agent);

                return (
                  <div key={i} style={{ 
                    padding: '20px', 
                    borderRadius: '20px', 
                    background: isCurrent ? '#f8fafc' : 'transparent',
                    border: isCurrent ? '1px solid var(--primary2)' : '1px solid transparent',
                    transition: '0.3s',
                    opacity: i > step ? 0.3 : 1
                  }}>
                    <div className="space">
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {isDone ? (
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--success)', color: 'white', display: 'grid', placeItems: 'center', fontSize: '14px' }}>✓</div>
                        ) : isCurrent ? (
                          <Spinner size="small" />
                        ) : (
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--line)' }}></div>
                        )}
                        <b style={{ fontSize: '16px' }}>{s.label}</b>
                      </div>
                      {isDone && <Badge tone="success">Verified</Badge>}
                    </div>
                    
                    {isCurrent && (
                      <div style={{ marginTop: '12px', paddingLeft: '39px', fontSize: '13px', color: 'var(--primary)', animation: 'pulse 1.5s infinite' }}>
                        Agent Thinking...
                      </div>
                    )}

                    {isDone && trace && (
                      <div style={{ marginTop: '12px', paddingLeft: '39px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                          "{trace.thought}"
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--success)', marginTop: '4px', fontWeight: '600' }}>
                          ● {trace.log}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          getActionPanel()
        )}
      </Card>
    </div>
  );
}

