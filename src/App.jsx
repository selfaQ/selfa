// جذر التطبيق — يضبط التوجيه بين الشاشات الست

import { Routes, Route, Navigate } from 'react-router-dom';

import WelcomePage   from './pages/WelcomePage';
import PriorityPage  from './pages/PriorityPage';
import PaymentPage   from './pages/PaymentPage';
import TrackingPage  from './pages/TrackingPage';
import SelfSalfaPage from './pages/SelfSalfaPage';
import ProfilePage   from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/"           element={<WelcomePage />}   />
      <Route path="/priority"   element={<PriorityPage />}  />
      <Route path="/payment"    element={<PaymentPage />}   />
      <Route path="/tracking"   element={<TrackingPage />}  />
      <Route path="/self-salfa" element={<SelfSalfaPage />} />
      <Route path="/profile"    element={<ProfilePage />}   />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
}
