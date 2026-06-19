// تسجيل الدخول والتسجيل

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { loginUser, registerUser } from '../api/auth';

const INPUT = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(14,165,114,0.25)',
  background: '#ffffff',
  color: '#0d1f17',
  fontSize: '13px',
  outline: 'none',
  direction: 'rtl',
};

export default function Login() {
  const navigate = useNavigate();
  const setAuth  = useStore(s => s.setAuth);

  const [tab,      setTab]      = useState('login');   // 'login' | 'register'
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // حقول مشتركة
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // حقول التسجيل فقط
  const [fullName, setFullName] = useState('');
  const [phone,    setPhone]    = useState('');
  const [salary,   setSalary]   = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(username.trim(), password);
      setAuth({ token: res.token, username: res.username, salary: 0, expiresAt: res.expiresAt });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!username.trim() || !password || !fullName.trim() || !phone.trim() || !salary) return;
    setError('');
    setLoading(true);
    try {
      const res = await registerUser({
        username:     username.trim(),
        password,
        fullName:     fullName.trim(),
        phoneNumber:  phone.trim(),
        salaryAmount: Number(salary),
      });
      setAuth({
        token:      res.token,
        username:   res.username,
        fullName:   fullName.trim(),
        salary:     Number(salary),
        expiresAt:  res.expiresAt,
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col page-enter" style={{ background: '#f4f9f6' }}>

      {/* رأس */}
      <div className="pt-14 pb-8 px-5 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-3xl font-black"
          style={{ background: 'linear-gradient(135deg, #0ea572, #096b41)', boxShadow: '0 4px 18px rgba(14,165,114,0.30)' }}>
          Q
        </div>
        <div className="text-[20px] font-bold text-t1">سلفة Q</div>
        <div className="text-[11px] text-t3 mt-1">نظام الادخار التناوبي الرقمي</div>
      </div>

      {/* البطاقة */}
      <div className="mx-4 rounded-2xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid rgba(14,165,114,0.15)', boxShadow: '0 2px 20px rgba(14,165,114,0.08)' }}>

        {/* تبويبات */}
        <div className="grid grid-cols-2 p-1 gap-1"
          style={{ background: '#f4f9f6', borderBottom: '1px solid rgba(14,165,114,0.10)' }}>
          {[
            { key: 'login',    label: 'تسجيل الدخول' },
            { key: 'register', label: 'حساب جديد'     },
          ].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setError(''); }}
              className="py-2.5 rounded-xl text-[12px] font-bold transition-all"
              style={{
                background: tab === t.key ? '#ffffff' : 'transparent',
                color:      tab === t.key ? '#0ea572' : '#6b9b80',
                boxShadow:  tab === t.key ? '0 1px 6px rgba(14,165,114,0.12)' : 'none',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* النموذج */}
        <form onSubmit={tab === 'login' ? handleLogin : handleRegister}
          className="p-4 flex flex-col gap-3">

          {tab === 'register' && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-t3">الاسم الكامل</label>
                <input style={INPUT} placeholder="أحمد محمد علي"
                  value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-t3">رقم الهاتف</label>
                <input style={INPUT} placeholder="07XXXXXXXXX" type="tel"
                  value={phone} onChange={e => setPhone(e.target.value)} required dir="ltr" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-t3">الراتب الشهري (د.ع)</label>
                <input style={INPUT} placeholder="1500000" type="number" min="0"
                  value={salary} onChange={e => setSalary(e.target.value)} required dir="ltr" />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-t3">اسم المستخدم</label>
            <input style={INPUT} placeholder="user1"
              value={username} onChange={e => setUsername(e.target.value)} required
              autoComplete="username" dir="ltr" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-t3">كلمة المرور</label>
            <input style={INPUT} placeholder="••••••••" type="password"
              value={password} onChange={e => setPassword(e.target.value)} required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'} dir="ltr" />
            {tab === 'register' && (
              <span className="text-[9px] text-t3">8 أحرف على الأقل وتحتوي على رقم</span>
            )}
          </div>

          {error && (
            <div className="rounded-xl px-3 py-2.5 text-[11px] font-semibold text-center"
              style={{ background: 'rgba(224,53,53,0.07)', color: '#e03535', border: '1px solid rgba(224,53,53,0.18)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-[14px] font-bold mt-1 transition-all"
            style={{
              background: loading ? 'rgba(14,165,114,0.5)' : '#0d8a52',
              color: '#fff',
              boxShadow: loading ? 'none' : '0 2px 14px rgba(13,138,82,0.30)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}>
            {loading
              ? 'جارٍ...'
              : tab === 'login' ? 'دخول' : 'إنشاء الحساب'}
          </button>
        </form>
      </div>

      <div className="text-center text-[9px] text-t3 mt-4 mb-8">
        مدعوم بنظام Qi Card الحكومي العراقي
      </div>
    </div>
  );
}
