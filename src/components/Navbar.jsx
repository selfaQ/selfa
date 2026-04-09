// شريط التنقل العلوي — يتغير بناءً على حالة تسجيل الدخول

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
  }

  // رابط نشط
  const linkClass = (path) =>
    `text-sm font-medium transition-colors ${
      pathname === path ? 'text-primary' : 'text-slate-600 hover:text-primary'
    }`;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="flex items-center justify-between px-4 py-3">
        {/* الشعار */}
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white font-black text-sm">Q</span>
          </div>
          <span className="font-black text-navy text-base">سلفة Q</span>
        </Link>

        {/* روابط التنقل */}
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>جمعياتي</Link>
              <Link to="/browse"    className={linkClass('/browse')}>استعرض</Link>
              <Link to="/create"    className={linkClass('/create')}>أنشئ</Link>

              {/* جرس الإشعارات */}
              <NotificationBell />

              {/* صورة المستخدم + تسجيل الخروج */}
              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold">
                  {user?.initials ?? '؟'}
                </button>
                {/* قائمة منسدلة */}
                <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                  <p className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100">{user?.name}</p>
                  <Link to="/admin" className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    لوحة الإدارة
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/browse" className={linkClass('/browse')}>استعرض</Link>
              <Link
                to="/login"
                className="px-4 py-1.5 bg-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
              >
                ابدأ الآن
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
