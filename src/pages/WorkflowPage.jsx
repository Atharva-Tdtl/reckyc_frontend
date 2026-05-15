import React, { useState } from 'react';
import { workflowSteps } from '../data/mockData.js';
import { Button, Card, PageTitle, Modal } from '../components/UI.jsx';

export default function WorkflowPage({ showToast }) {
  const [condition, setCondition] = useState('');
  const [action, setAction] = useState('');
  const [sla, setSla] = useState('');
  const [rules, setRules] = useState([]);
  
  const [selectedStep, setSelectedStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [stepInput, setStepInput] = useState('');

  const handleSaveRule = () => {
    if (!condition || !action || !sla) {
      if (showToast) showToast('Please fill all three fields', 'error');
      return;
    }
    setRules([...rules, { condition, action, sla }]);
    if (showToast) showToast('Rule saved successfully');
    setCondition('');
    setAction('');
    setSla('');
  };

  const getStepMode = (stepName) => {
    if (['OCR & Extraction', 'Identity Verification', 'Address Verification', 'AML Risk Scoring', 'Monitoring & Alerts'].includes(stepName)) return 'AI';
    if (['CKYC Update'].includes(stepName)) return 'Integration';
    return 'Human';
  };

  const getBorderColor = (mode) => {
    if (mode === 'AI') return '#3b82f6';
    if (mode === 'Integration') return '#22c55e';
    return '#f59e0b';
  };

  const handleMarkComplete = () => {
    if (selectedStep) {
      if (!completedSteps.includes(selectedStep.name)) {
        setCompletedSteps([...completedSteps, selectedStep.name]);
      }
      if (showToast) showToast(`${selectedStep.name} verified and completed`);
      
      const currentIndex = workflowSteps.indexOf(selectedStep.name);
      if (currentIndex !== -1 && currentIndex < workflowSteps.length - 1) {
        const nextStepName = workflowSteps[currentIndex + 1];
        const mode = getStepMode(nextStepName);
        setSelectedStep({ name: nextStepName, mode, description: `Details for ${nextStepName} step.` });
        setStepInput(''); // clear input for next step
      } else {
        if (showToast && currentIndex === workflowSteps.length - 1) {
          showToast('All workflow steps completed!', 'success');
        }
        setSelectedStep(null);
        setStepInput('');
      }
    }
  };

  const getAppliedLogic = (stepName, text) => {
    const applied = [];
    const lowerText = text.toLowerCase();
    
    // Custom Rules
    rules.forEach(r => {
      const condKeywords = r.condition.toLowerCase().replace('if ', '').split(' ');
      if (condKeywords.some(k => k.length > 3 && lowerText.includes(k))) {
        applied.push(`Rule Applied: ${r.condition} → ${r.action}`);
      }
    });

    // Matrix & Default conditions matching
    if (stepName === 'AML Risk Scoring' || lowerText.includes('risk')) {
      if (lowerText.includes('high')) applied.push('Matrix Used: High risk → Compliance approval');
      else if (lowerText.includes('medium')) applied.push('Matrix Used: Medium risk → Maker review');
      else if (lowerText.includes('low') || text === '') applied.push('Matrix Used: Low risk → Auto approval');
    }
    
    if (lowerText.includes('mismatch')) {
       applied.push('Rule Applied: If address mismatch → Create field verification task');
    }
    if (lowerText.includes('expired')) {
       applied.push('Rule Applied: If document expired → Send deficiency notification');
    }
    if (lowerText.includes('edd')) {
       applied.push('Matrix Used: EDD → Senior compliance + audit');
    }

    return [...new Set(applied)];
  };

  const appliedLogic = selectedStep ? getAppliedLogic(selectedStep.name, stepInput) : [];

  return <>
    <PageTitle title="Workflow Automation Engine" subtitle="End-to-end KYC lifecycle automation from capture to CKYC update and continuous alerts."/>
    <Card>
      <div className="workflow">
        {workflowSteps.map((s, i) => {
          const mode = getStepMode(s);
          const isCompleted = completedSteps.includes(s);
          return (
            <div 
              className="step" 
              key={s} 
              style={{ 
                borderLeft: `4px solid ${getBorderColor(mode)}`, 
                cursor: 'pointer',
                opacity: isCompleted ? 0.7 : 1,
                backgroundColor: isCompleted ? '#f0fdf4' : undefined
              }}
              onClick={() => {
                setSelectedStep({ name: s, mode, description: `Details for ${s} step.` });
                setStepInput('');
              }}
            >
              <span style={{ backgroundColor: isCompleted ? '#16a34a' : '' }}>
                {isCompleted ? '✓' : i+1}
              </span>
              <b style={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#166534' : 'inherit' }}>{s}</b>
              <p>{mode === 'AI' ? 'AI automated' : 'Human governance / integration'}</p>
            </div>
          );
        })}
      </div>
    </Card>
    
    <div className="grid two">
      <Card>
        <h3>Rules Builder</h3>
        <div className="form-grid">
          <select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="">Select Condition...</option>
            <option value="If risk = High">If risk = High</option>
            <option value="If document expired">If document expired</option>
            <option value="If address mismatch">If address mismatch</option>
          </select>
          <select value={action} onChange={e => setAction(e.target.value)}>
            <option value="">Select Action...</option>
            <option value="Trigger EDD">Trigger EDD</option>
            <option value="Send deficiency notification">Send deficiency notification</option>
            <option value="Create field verification task">Create field verification task</option>
          </select>
          <input placeholder="SLA in hours" value={sla} onChange={e => setSla(e.target.value)}/>
          <Button onClick={handleSaveRule}>Save Rule</Button>
        </div>
        
        {rules.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Saved Rules</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {rules.map((r, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  IF <strong>{r.condition}</strong> &rarr; <strong>{r.action}</strong> (SLA: {r.sla}h)
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
      <Card>
        <h3>Maker-Checker Matrix</h3>
        <div className="feature-grid">
          <div>Low risk: Auto approval</div>
          <div>Medium risk: Maker review</div>
          <div>High risk: Compliance approval</div>
          <div>EDD: Senior compliance + audit</div>
        </div>
      </Card>
    </div>

    <Modal open={!!selectedStep} onClose={() => setSelectedStep(null)} title={selectedStep?.name}>
      {selectedStep && (
        <div>
          <p><strong>Mode:</strong> {selectedStep.mode}</p>
          <p><strong>Description:</strong> {selectedStep.description}</p>
          
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Verification Input / Notes
            </label>
            <textarea 
              value={stepInput}
              onChange={e => setStepInput(e.target.value)}
              placeholder={`Enter verification data for ${selectedStep.name}... (Try typing "high risk" or "mismatch" to trigger rules)`}
              style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'inherit' }}
            />
          </div>

          {appliedLogic.length > 0 && (
            <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #93c5fd', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1d4ed8', fontSize: '14px' }}>Decision Engine Log</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#1e3a8a' }}>
                {appliedLogic.map((logic, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}><strong>{logic.split(':')[0]}:</strong> {logic.split(':')[1]}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setSelectedStep(null)}>Close</Button>
            <Button onClick={handleMarkComplete}>
              {workflowSteps.indexOf(selectedStep.name) < workflowSteps.length - 1 ? 'Verify & Next Step' : 'Verify & Finish'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  </>
}
