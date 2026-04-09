// سياق السلفات — يخزن جمعيات المستخدم النشطة والإشعارات

import { createContext, useContext, useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/constants';

const SalafaContext = createContext(null);

export function SalafaProvider({ children }) {
  // الجمعيات النشطة للمستخدم الحالي
  const [mySalafat, setMySalafat] = useState([
    // جمعية نشطة تجريبية للعرض
    {
      id: 101,
      amount: 5_000_000,
      duration: 10,
      myTurn: 3,
      monthsPaid: 2,
      nextDeduction: '2025-05-01',
      seatType: 'priority',
      prioritySeat: 1,
      joinedAt: '2025-03-01',
    },
  ]);

  // الإشعارات
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // عدد الإشعارات غير المقروءة
  const unreadCount = notifications.filter(n => !n.read).length;

  /** الانضمام لجمعية جديدة */
  function joinSalafa(salafa) {
    const newEntry = {
      id: Date.now(),
      amount:        salafa.amount,
      duration:      salafa.duration,
      myTurn:        salafa.selectedTurn ?? Math.floor(Math.random() * salafa.duration) + 1,
      monthsPaid:    0,
      nextDeduction: salafa.startDate ?? '2025-06-01',
      seatType:      salafa.seatType ?? 'lottery',
      prioritySeat:  salafa.prioritySeat ?? null,
      joinedAt:      new Date().toISOString().slice(0, 10),
    };
    setMySalafat(prev => [...prev, newEntry]);

    // إضافة إشعار تأكيد
    setNotifications(prev => [{
      id: Date.now(),
      type: 'turn',
      title: 'تم الانضمام بنجاح',
      body: `انضممت لجمعية ${salafa.amount.toLocaleString('ar-IQ')} د.ع — دورك الشهر ${newEntry.myTurn}`,
      time: 'الآن',
      read: false,
    }, ...prev]);
  }

  /** تحديد إشعار كمقروء */
  function markRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  /** تحديد جميع الإشعارات كمقروءة */
  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  return (
    <SalafaContext.Provider value={{
      mySalafat, notifications, unreadCount,
      joinSalafa, markRead, markAllRead,
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
