// سياق السلفات — يجلب جمعيات المستخدم من الـ API

import { createContext, useContext, useState, useEffect } from 'react';
import { getMyLoans, mapLoan } from '../api/loans';
import { confirmLottery as confirmLotteryApi } from '../api/groups';
import { MOCK_NOTIFICATIONS } from '../data/constants';

const SalafaContext = createContext(null);

export function SalafaProvider({ children }) {
  const [mySalafat,   setMySalafat]   = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  async function refreshLoans() {
    setLoadingLoans(true);
    try {
      const loans = await getMyLoans();
      setMySalafat(loans.map(mapLoan));
    } catch (e) {
      console.error('loans fetch failed:', e);
    } finally {
      setLoadingLoans(false);
    }
  }

  useEffect(() => {
    try {
      const { token } = JSON.parse(localStorage.getItem('qi_auth') ?? '{}');
      if (token) { refreshLoans(); return; }
    } catch {}
    setLoadingLoans(false);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  function addJoinNotification(amount) {
    setNotifications(prev => [{
      id:    Date.now(),
      type:  'turn',
      title: 'تم الانضمام بنجاح',
      body:  `انضممت لجمعية ${amount.toLocaleString('ar-IQ')} د.ع — القرعة ستُجرى قريباً`,
      time:  'الآن',
      read:  false,
    }, ...prev]);
  }

  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function confirmLottery(groupId) {
    await confirmLotteryApi(groupId);
    await refreshLoans();
    setNotifications(prev => [{
      id: Date.now(), type: 'success',
      title: 'تم تأكيد دورك', body: 'تم تأكيد مشاركتك في السلفة بنجاح',
      time: 'الآن', read: false,
    }, ...prev]);
  }

  return (
    <SalafaContext.Provider value={{
      mySalafat, loadingLoans, notifications, unreadCount,
      refreshLoans, addJoinNotification, markRead, markAllRead,
      confirmLottery,
    }}>
      {children}
    </SalafaContext.Provider>
  );
}

export function useSalafa() {
  const ctx = useContext(SalafaContext);
  if (!ctx) throw new Error('useSalafa يجب أن يُستخدم داخل SalafaProvider');
  return ctx;
}
