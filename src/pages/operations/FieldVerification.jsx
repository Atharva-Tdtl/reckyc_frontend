import React, { useState } from 'react';
import { Card, PageTitle, Badge, Button, Toast } from '../../components/UI';

export default function FieldVerification() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [location, setLocation] = useState(null);
  const [toast, setToast] = useState(null);

  const cases = [
    { id: 'KYC-24005', customer: 'Manish Shah', address: '45, Industrial Area, Bangalore', status: 'Pending' },
    { id: 'KYC-24009', customer: 'Anita Desai', address: 'Flat 202, Rose Garden, Pune', status: 'In Progress' }
  ];

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setToast({ message: 'GPS Location Captured', type: 'success' });
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Field report submitted successfully', type: 'success' });
    setSelectedCase(null);
  };

  return (
    <div>
      <PageTitle title="Field Verification" subtitle="Physical address and property verification module" />

      {!selectedCase ? (
        <Card style={{ padding: 0 }}>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id}>
                    <td><b>{c.id}</b></td>
                    <td>{c.customer}</td>
                    <td>{c.address}</td>
                    <td><Badge tone={c.status === 'Pending' ? 'warning' : 'info'}>{c.status}</Badge></td>
                    <td><Button onClick={() => setSelectedCase(c)}>Start Verification</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Button variant="secondary" onClick={() => setSelectedCase(null)} style={{ marginBottom: '20px' }}>← Back to List</Button>
          <Card style={{ padding: '30px' }}>
            <h3>Verification Checklist: {selectedCase.customer}</h3>
            <p className="muted">{selectedCase.address}</p>

            <form onSubmit={handleSubmit} className="grid" style={{ marginTop: '30px' }}>
              <div className="card" style={{ padding: '20px', background: '#f8fafc' }}>
                <div className="space">
                  <span>Customer present at address?</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <label><input type="radio" name="present" required /> Yes</label>
                    <label><input type="radio" name="present" /> No</label>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '20px', background: '#f8fafc' }}>
                <div className="space">
                  <span>Address matches documents?</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <label><input type="radio" name="match" required /> Yes</label>
                    <label><input type="radio" name="match" /> No</label>
                  </div>
                </div>
              </div>

              <div className="role-switcher">
                <label>Property Condition</label>
                <select required>
                  <option value="">Select</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="role-switcher">
                <label>Photographs Upload</label>
                <div className="upload-box" style={{ padding: '20px' }}>
                  Click to upload property photos
                </div>
              </div>

              <div className="card" style={{ padding: '20px', border: '1px solid var(--primary)', background: 'var(--primary2)' }}>
                <div className="space">
                  <div>
                    <b>Geo-location Tagging</b>
                    {location && <div className="muted" style={{ fontSize: '12px' }}>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</div>}
                  </div>
                  <Button onClick={captureLocation} variant="secondary">Capture GPS</Button>
                </div>
              </div>

              <textarea placeholder="Notes from field visit..." required />
              
              <Button type="submit" style={{ width: '100%', padding: '15px' }}>Submit Field Report</Button>
            </form>
          </Card>
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
