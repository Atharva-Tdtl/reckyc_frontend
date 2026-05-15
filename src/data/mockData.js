export const roles = ['CXO', 'Operations Manager', 'Compliance Officer', 'Maker', 'Checker', 'Field Agent'];

export const kpiCards = [
  { label: 'KYC Completion Rate', value: '91.8%', trend: '+7.2%', tone: 'success' },
  { label: 'Compliance Score', value: '98.6%', trend: '+1.1%', tone: 'success' },
  { label: 'Pending Cases', value: '1,248', trend: '-12%', tone: 'warning' },
  { label: 'High Risk Profiles', value: '186', trend: '+23', tone: 'danger' },
  { label: 'Avg TAT', value: '4m 18s', trend: '-39s', tone: 'success' },
  { label: 'Automation Rate', value: '86.4%', trend: '+5.4%', tone: 'success' }
];

export const riskDistribution = [
  { name: 'Low', value: 6440 },
  { name: 'Medium', value: 1920 },
  { name: 'High', value: 612 },
  { name: 'EDD', value: 186 }
];

export const monthlyTrend = [
  { month: 'Jan', onboarded: 820, rekyc: 310, fraud: 18 },
  { month: 'Feb', onboarded: 960, rekyc: 420, fraud: 24 },
  { month: 'Mar', onboarded: 1210, rekyc: 540, fraud: 27 },
  { month: 'Apr', onboarded: 1380, rekyc: 660, fraud: 36 },
  { month: 'May', onboarded: 1550, rekyc: 720, fraud: 31 },
  { month: 'Jun', onboarded: 1690, rekyc: 810, fraud: 42 }
];

export const agents = [
  { name: 'Customer Intake Agent', status: 'Active', accuracy: 97.2, load: 72, description: 'Branch, web/mobile, DSA, builder and co-lending intake orchestration.' },
  { name: 'Document Intake & OCR Agent', status: 'Active', accuracy: 94.8, load: 81, description: 'OCR, document classification, multilingual parsing and field extraction.' },
  { name: 'Document Understanding Agent', status: 'Active', accuracy: 95.8, load: 74, description: 'Extracts Name, DOB, Address, Document numbers and validates cross-document consistency.' },
  { name: 'Identity Verification Agent', status: 'Active', accuracy: 96.4, load: 66, description: 'Aadhaar offline XML/OTP, PAN, CKYC, DigiLocker, face match and liveness checks.' },
  { name: 'Address Verification Agent', status: 'Review', accuracy: 91.3, load: 58, description: 'Current/permanent address validation, geo-tagging and field verification triggers.' },
  { name: 'AML Risk Agent', status: 'Active', accuracy: 95.1, load: 76, description: 'Sanctions, PEP, adverse media, profile risk and EDD recommendations.' },
  { name: 'Re-KYC & Periodic Review Agent', status: 'Active', accuracy: 98.6, load: 45, description: 'Triggers periodic KYC updates, tracks document expiry and customer profile changes.' },
  { name: 'Fraud Detection Agent', status: 'Active', accuracy: 93.7, load: 69, description: 'Fake document, duplicate identity and suspicious pattern detection.' },
  { name: 'Compliance & Audit Agent', status: 'Active', accuracy: 99.1, load: 48, description: 'Audit trail, evidence pack, regulatory reports and tamper-proof logs.' },
  { name: 'Communication Agent', status: 'Active', accuracy: 98.3, load: 53, description: 'Re-KYC reminders, deficiency alerts and omnichannel notifications.' }
];

export const cases = [
  { id: 'KYC-24001', customer: 'Rohan Mehta', type: 'Home Loan', segment: 'Salaried', risk: 'Low', status: 'Checker Review', stage: 'Approval Workflow', owner: 'Neha', tat: '3m 42s', flags: 0 },
  { id: 'KYC-24002', customer: 'Sara Khan', type: 'LAP', segment: 'Self-employed', risk: 'Medium', status: 'Document Deficiency', stage: 'Document Understanding', owner: 'Amit', tat: '14m 12s', flags: 2 },
  { id: 'KYC-24003', customer: 'Vikram Iyer', type: 'Construction Loan', segment: 'NRI', risk: 'High', status: 'EDD Required', stage: 'AML Risk', owner: 'Compliance', tat: '28m 02s', flags: 5 },
  { id: 'KYC-24004', customer: 'Priya Nair', type: 'Home Loan', segment: 'Joint Applicant', risk: 'Low', status: 'CKYC Upload', stage: 'CKYC Update', owner: 'Rahul', tat: '4m 55s', flags: 0 },
  { id: 'KYC-24005', customer: 'Manish Shah', type: 'Re-KYC', segment: 'High Risk', risk: 'EDD', status: 'Field Verification', stage: 'Address Verification', owner: 'Field Team', tat: '2h 11m', flags: 7 }
];

export const auditLogs = [
  { time: '10:02:44', actor: 'OCR Agent', action: 'Extracted PAN and Aadhaar fields', caseId: 'KYC-24002', result: 'Passed with confidence 94.2%' },
  { time: '10:07:11', actor: 'AML Risk Agent', action: 'PEP and sanctions screening', caseId: 'KYC-24003', result: 'High-risk escalation created' },
  { time: '10:09:26', actor: 'Checker', action: 'Approved maker recommendation', caseId: 'KYC-24001', result: 'Moved to CKYC upload' },
  { time: '10:14:52', actor: 'Fraud Agent', action: 'Duplicate identity scan', caseId: 'KYC-24005', result: 'Potential duplicate flagged' }
];

export const workflowSteps = [
  'Customer Capture', 'Document Upload', 'OCR & Extraction', 'Identity Verification', 'Address Verification', 'AML Risk Scoring', 'Maker Review', 'Checker Approval', 'CKYC Update', 'Monitoring & Alerts'
];
