// جذر التطبيق

import { Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';

import Login         from './pages/Login';
import HomePage      from './pages/HomePage';
import Browse        from './pages/Browse';
import SelfSalfaPage from './pages/SelfSalfaPage';
import PriorityPage  from './pages/PriorityPage';
import PaymentPage   from './pages/PaymentPage';
import TrackingPage  from './pages/TrackingPage';
import ProfilePage   from './pages/ProfilePage';
import SalafaDetail  from './pages/SalafaDetail';
import Dashboard     from './pages/Dashboard';

function RequireAuth({ children }) {
  const auth = useStore(s => s.auth);
  if (!auth?.token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/"           element={<RequireAuth><HomePage /></RequireAuth>}      />
      <Route path="/browse"     element={<RequireAuth><Browse /></RequireAuth>}        />
      <Route path="/self-salfa" element={<RequireAuth><SelfSalfaPage /></RequireAuth>} />
      <Route path="/priority"   element={<RequireAuth><PriorityPage /></RequireAuth>}  />
      <Route path="/payment"    element={<RequireAuth><PaymentPage /></RequireAuth>}   />
      <Route path="/tracking"   element={<RequireAuth><TrackingPage /></RequireAuth>}  />
      <Route path="/profile"    element={<RequireAuth><ProfilePage /></RequireAuth>}   />
      <Route path="/salafa/:id" element={<RequireAuth><SalafaDetail /></RequireAuth>}  />
      <Route path="/dashboard"  element={<RequireAuth><Dashboard /></RequireAuth>}     />
      <Route path="*"           element={<Navigate to="/" replace />} />
    </Routes>
  );
}
