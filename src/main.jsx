import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import RegisterLogin from './pages/customer/RegisterLogin';
import OnboardingForm from './pages/customer/OnboardingForm';
import DocumentUpload from './pages/customer/DocumentUpload';
import SelfieCapture from './pages/customer/SelfieCapture';
import AIProcessing from './pages/customer/AIProcessing';
import StatusTracker from './pages/customer/StatusTracker';

// Operations Pages
import CaseQueue from './pages/operations/CaseQueue';
import CaseDetail from './pages/operations/CaseDetail';
import MakerReview from './pages/operations/MakerReview';
import FieldVerification from './pages/operations/FieldVerification';

// CXO Pages
import CommandCenter from './pages/cxo/CommandCenter';
import RiskFraud from './pages/cxo/RiskFraud';
import ComplianceAudit from './pages/cxo/ComplianceAudit';
import AdminRBAC from './pages/cxo/AdminRBAC';

import './styles/app.css';

const AppLayout = ({ children, noSidebar }) => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="app-shell">
      {isAuthenticated && !noSidebar && <Sidebar />}
      <main style={{ marginLeft: isAuthenticated && !noSidebar ? '0' : '0', width: '100%', maxWidth: '100%' }}>
        {children}
      </main>
    </div>
  );
};

const Router = () => {
  return (
    <BrowserRouter basename="/rekyc">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppLayout noSidebar><LandingPage /></AppLayout>} />
        <Route path="/login" element={<AppLayout noSidebar><RegisterLogin /></AppLayout>} />

        {/* Customer Portal */}
        <Route path="/app/onboarding" element={<ProtectedRoute allowedRoles={['Customer']}><AppLayout noSidebar><OnboardingForm /></AppLayout></ProtectedRoute>} />
        <Route path="/app/documents" element={<ProtectedRoute allowedRoles={['Customer']}><AppLayout noSidebar><DocumentUpload /></AppLayout></ProtectedRoute>} />
        <Route path="/app/selfie" element={<ProtectedRoute allowedRoles={['Customer']}><AppLayout noSidebar><SelfieCapture /></AppLayout></ProtectedRoute>} />
        <Route path="/app/processing" element={<ProtectedRoute allowedRoles={['Customer']}><AppLayout noSidebar><AIProcessing /></AppLayout></ProtectedRoute>} />
        <Route path="/app/status" element={<ProtectedRoute allowedRoles={['Customer']}><AppLayout noSidebar><StatusTracker /></AppLayout></ProtectedRoute>} />

        {/* Operations Portal */}
        <Route path="/ops/cases" element={<ProtectedRoute allowedRoles={['Maker', 'Checker', 'Operations Manager']}><AppLayout><CaseQueue /></AppLayout></ProtectedRoute>} />
        <Route path="/ops/cases/:id" element={<ProtectedRoute allowedRoles={['Maker', 'Checker', 'Operations Manager']}><AppLayout><CaseDetail /></AppLayout></ProtectedRoute>} />
        <Route path="/ops/review/:id" element={<ProtectedRoute allowedRoles={['Maker', 'Checker']}><AppLayout><MakerReview /></AppLayout></ProtectedRoute>} />
        <Route path="/ops/field" element={<ProtectedRoute allowedRoles={['Field Agent', 'Operations Manager']}><AppLayout><FieldVerification /></AppLayout></ProtectedRoute>} />

        {/* CXO Portal */}
        <Route path="/cxo/dashboard" element={<ProtectedRoute allowedRoles={['CXO', 'Compliance Officer']}><AppLayout><CommandCenter /></AppLayout></ProtectedRoute>} />
        <Route path="/cxo/risk" element={<ProtectedRoute allowedRoles={['CXO', 'Compliance Officer']}><AppLayout><RiskFraud /></AppLayout></ProtectedRoute>} />
        <Route path="/cxo/compliance" element={<ProtectedRoute allowedRoles={['CXO', 'Compliance Officer']}><AppLayout><ComplianceAudit /></AppLayout></ProtectedRoute>} />
        <Route path="/cxo/admin" element={<ProtectedRoute allowedRoles={['CXO', 'Compliance Officer']}><AppLayout><AdminRBAC /></AppLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);
