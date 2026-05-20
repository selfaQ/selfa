// غلاف التطبيق — خلفية فاتحة + TabBar ثابت أسفل الشاشة

import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

export default function AppShell() {
  return (
    <div className="bg-slate-50 min-h-screen" style={{ overflowY: 'auto' }}>
      <div className="pb-24">
        <Outlet />
      </div>
      <TabBar />
    </div>
  );
}
