import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, PageTitle, Progress, Toast } from '../../components/UI';
import API from '../../api/client';
export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', dob: '', mobile: '', email: '', pan: '', aadhaarLast4: '', gender: '', maritalStatus: '',
    loanType: 'Home Loan', loanAmount: '', employmentType: 'Salaried', income: '', coBorrower: false,
    propertyAddress: '', builder: '', propertyType: 'Flat', propertyValue: ''
  });
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Split name into first/last for the model
      const [first_name, ...rest] = formData.fullName.split(' ');
      const last_name = rest.join(' ') || ' ';

      // 2. Create real Customer in MySQL
      const res = await API.post('/customers/', {
        ...formData,
        first_name,
        last_name,
        pan: formData.pan,
        aadhaar_last4: formData.aadhaarLast4
      });

      // 3. Create real Case in MySQL (Fixed URL path)
      const caseRes = await API.post('/cases/list/create_from_customer/', { customer_id: res.data.id });
      
      // 4. Save Case ID for the AI Processing step
      localStorage.setItem('active_case_id', caseRes.data.id);
      
      setToast({ message: 'Application saved successfully', type: 'success' });
      setTimeout(() => navigate('/app/documents'), 1500);
    } catch(err) {
      setToast({ message: 'Failed to save application', type: 'danger' });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <PageTitle title="KYC Application" subtitle="Please provide your details to initiate the KYC process" />
      
      <div style={{ marginBottom: '30px' }}>
        <div className="space">
          <span className="muted">Step {step} of 3</span>
          <span className="muted">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 3) * 100} color="var(--primary)" />
      </div>

      <Card style={{ padding: '30px' }}>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="grid form-grid">
              <h3>Personal Details</h3>
              <div style={{ gridColumn: '1/-1' }} className="role-switcher">
                <label>Full Name</label>
                <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="role-switcher"><label>Date of Birth</label><input type="date" required value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
              <div className="role-switcher"><label>Mobile Number</label><input type="tel" required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} /></div>
              <div className="role-switcher"><label>Email Address</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              <div className="role-switcher">
                <label>PAN Number</label>
                <input type="text" required value={formData.pan} 
                  onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})} 
                  placeholder="ABCDE1234F" maxLength="10" />
              </div>
              <div className="role-switcher">
                <label>Aadhaar (Last 4 digits)</label>
                <input type="text" required value={formData.aadhaarLast4} 
                  onChange={e => setFormData({...formData, aadhaarLast4: e.target.value.replace(/\D/g,'').slice(0,4)})} 
                  placeholder="0000" maxLength="4" />
              </div>
              <div className="role-switcher">
                <label>Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid form-grid">
              <h3>Financial Details</h3>
              <div className="role-switcher">
                <label>Loan Type</label>
                <select value={formData.loanType} onChange={e => setFormData({...formData, loanType: e.target.value})}>
                  <option value="Home Loan">Home Loan</option>
                  <option value="LAP">Loan Against Property</option>
                  <option value="Construction Loan">Construction Loan</option>
                </select>
              </div>
              <div className="role-switcher"><label>Loan Amount (₹)</label><input type="number" required value={formData.loanAmount} onChange={e => setFormData({...formData, loanAmount: e.target.value})} /></div>
              <div className="role-switcher">
                <label>Employment Type</label>
                <select value={formData.employmentType} onChange={e => setFormData({...formData, employmentType: e.target.value})}>
                  <option value="Salaried">Salaried</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="NRI">NRI</option>
                  <option value="Joint">Joint Applicant</option>
                </select>
              </div>
              <div className="role-switcher"><label>Monthly Income (₹)</label><input type="number" required value={formData.income} onChange={e => setFormData({...formData, income: e.target.value})} /></div>
              <div style={{ gridColumn: '1/-1', marginTop: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" checked={formData.coBorrower} onChange={e => setFormData({...formData, coBorrower: e.target.checked})} />
                  Add Co-borrower?
                </label>
              </div>
              {formData.coBorrower && (
                <>
                  <div className="role-switcher"><label>Co-borrower Name</label><input type="text" /></div>
                  <div className="role-switcher"><label>Co-borrower PAN</label><input type="text" /></div>
                </>
              )}
              <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button variant="secondary" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid form-grid">
              <h3>Property Details</h3>
              <div style={{ gridColumn: '1/-1' }} className="role-switcher">
                <label>Property Address</label>
                <textarea value={formData.propertyAddress} onChange={e => setFormData({...formData, propertyAddress: e.target.value})} />
              </div>
              <div className="role-switcher"><label>Builder/Developer</label><input type="text" value={formData.builder} onChange={e => setFormData({...formData, builder: e.target.value})} /></div>
              <div className="role-switcher"><label>Broker/DSA Name (Optional)</label><input type="text" /></div>
              <div className="role-switcher">
                <label>Property Type</label>
                <select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}>
                  <option value="Flat">Flat</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Under construction">Under construction</option>
                </select>
              </div>
              <div className="role-switcher"><label>Estimated Property Value (₹)</label><input type="number" required value={formData.propertyValue} onChange={e => setFormData({...formData, propertyValue: e.target.value})} /></div>
              
              <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button variant="secondary" onClick={prevStep}>Back</Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </div>
          )}
        </form>
      </Card>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
