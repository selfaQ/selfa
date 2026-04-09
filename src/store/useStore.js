// المخزن العام — Zustand يحتفظ بحالة التطبيق بين الصفحات

import { create } from 'zustand';

const useStore = create((set) => ({

  // ─── بيانات المستخدم (مستوردة تلقائياً من ki Card) ──────────────────────────
  user: {
    name:            'أحمد محمد علي',
    accountNumber:   'KI-2271-9904',
    accountType:     'government',   // 'government' | 'private' | 'personal'
    typeLabel:       'موظف حكومي',
    salary:          2_000_000,
    maxInstallment:  800_000,        // الراتب × 40%
  },

  // ─── منشئ السلفة — ما يختاره المستخدم حالياً ────────────────────────────────
  builder: {
    duration: 18,     // المدة المختارة: 10 | 18 | 24
    amount:   null,   // المبلغ المختار (IQD)
    priority: null,   // 1 | 2 | 3 | 'raffle'
  },

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** تغيير المدة (يُصفّر المبلغ لأن الحسابات تتغير) */
  setDuration: (d) => set((s) => ({
    builder: { ...s.builder, duration: d, amount: null },
  })),

  /** اختيار المبلغ */
  setAmount: (a) => set((s) => ({
    builder: { ...s.builder, amount: a },
  })),

  /** اختيار الأولوية */
  setPriority: (p) => set((s) => ({
    builder: { ...s.builder, priority: p },
  })),

  /** تصفير المنشئ بعد الدفع */
  resetBuilder: () => set((s) => ({
    builder: { duration: 18, amount: null, priority: null },
  })),

  // ─── الجمعيات النشطة (تُضاف بعد الدفع) ─────────────────────────────────────
  activeSalfas: [],

  addSalfa: (salfa) => set((s) => ({
    activeSalfas: [...s.activeSalfas, salfa],
  })),
}));

export default useStore;
