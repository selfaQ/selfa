// المخزن العام — Zustand

import { create } from 'zustand';

function loadAuth() {
  try { return JSON.parse(localStorage.getItem('qi_auth')); }
  catch { return null; }
}

function genAccountNumber(username) {
  if (!username) return '0000-000-000';
  let h = 0;
  for (let i = 0; i < username.length; i++) {
    h = Math.imul(31, h) + username.charCodeAt(i) | 0;
  }
  const n = String((Math.abs(h) % 9000000000) + 1000000000);
  return n.slice(0, 4) + '-' + n.slice(4, 7) + '-' + n.slice(7);
}

function deriveUser(auth) {
  if (!auth) return {
    name: '', accountNumber: '0000-000-000',
    accountType: 'government', typeLabel: 'موظف',
    salary: 0, maxInstallment: 0,
  };
  const salary = auth.salary ?? 0;
  return {
    name:           auth.fullName ?? auth.username ?? 'مستخدم',
    accountNumber:  genAccountNumber(auth.username),
    accountType:    'government',
    typeLabel:      'موظف',
    salary,
    maxInstallment: Math.round(salary * 0.4),
  };
}

const useStore = create((set) => {
  const auth = loadAuth();
  return {
    // ─── مصادقة ────────────────────────────────────────────────────────────
    auth,
    user: deriveUser(auth),

    setAuth: (auth) => {
      localStorage.setItem('qi_auth', JSON.stringify(auth));
      set({ auth, user: deriveUser(auth) });
    },

    clearAuth: () => {
      localStorage.removeItem('qi_auth');
      set({ auth: null, user: deriveUser(null) });
    },

    // ─── منشئ السلفة الذاتية ────────────────────────────────────────────────
    builder: { duration: 18, amount: null, priority: null },

    setDuration: (d) => set((s) => ({
      builder: { ...s.builder, duration: d, amount: null },
    })),
    setAmount: (a) => set((s) => ({
      builder: { ...s.builder, amount: a },
    })),
    setPriority: (p) => set((s) => ({
      builder: { ...s.builder, priority: p },
    })),
    resetBuilder: () => set(() => ({
      builder: { duration: 18, amount: null, priority: null },
    })),
  };
});

export default useStore;
