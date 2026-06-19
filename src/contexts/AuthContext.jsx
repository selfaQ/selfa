// سياق المصادقة — يخزن بيانات الحساب المختار ويتيحها لجميع المكونات

import { createContext, useContext, useState } from 'react';

// إنشاء السياق
const AuthContext = createContext(null);

// مزود السياق — يُلف التطبيق بالكامل في main.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = غير مسجل

  /** تسجيل الدخول باختيار حساب Qi Card */
  function login(account) {
    setUser(account);
  }

  /** تسجيل الخروج */
  function logout() {
    setUser(null);
  }

  /** هل المستخدم مسجل دخوله؟ */
  const isLoggedIn = user !== null;

  /** هل النوع: موظف حكومي أو قطاع خاص (بدون كفيل) */
  const isEmployee = user?.type === 'government' || user?.type === 'private';

  /** 40% من الراتب = الحد الأقصى المسموح به للأقساط الشهرية */
  const maxInstallment = user ? user.salary * 0.4 : 0;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isEmployee, maxInstallment, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// هوك مخصص لاستخدام السياق بسهولة
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth يجب أن يُستخدم داخل AuthProvider');
  return ctx;
}
