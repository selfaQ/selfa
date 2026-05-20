// جذر التطبيق

import { Routes, Route, Navigate } from 'react-router-dom';

import WelcomePage   from './pages/WelcomePage';
import PriorityPage  from './pages/PriorityPage';
import PaymentPage   from './pages/PaymentPage';
import TrackingPage  from './pages/TrackingPage';
import SelfSalfaPage from './pages/SelfSalfaPage';
import ProfilePage   from './pages/ProfilePage';
import Browse        from './pages/Browse';
import SalafaDetail  from './pages/SalafaDetail';
import Dashboard     from './pages/Dashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<WelcomePage />}   />
      <Route path="/priority"    element={<PriorityPage />}  />
      <Route path="/payment"     element={<PaymentPage />}   />
      <Route path="/tracking"    element={<TrackingPage />}  />
      <Route path="/self-salfa"  element={<SelfSalfaPage />} />
      <Route path="/profile"     element={<ProfilePage />}   />
      <Route path="/browse"      element={<Browse />}        />
      <Route path="/salafa/:id"  element={<SalafaDetail />}  />
      <Route path="/dashboard"   element={<Dashboard />}     />
      <Route path="*"            element={<Navigate to="/" replace />} />
    </Routes>
  );
}
