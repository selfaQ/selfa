// All mock data, constants, and helper functions for Salfa Q

export const USER = {
  name: "أحمد الجميلي",
  salary: 750000,
  type: "employee",
  bank: "مصرف الرافدين",
};

export const AMOUNTS = [
  500000, 1000000, 2000000, 3000000, 5000000,
  7000000, 10000000, 15000000, 20000000, 25000000,
];

export const PRIORITIES = [
  { id: 0, label: "الاسم الأول",  fee: 10000 },
  { id: 1, label: "الاسم الثاني", fee: 7000  },
  { id: 2, label: "الاسم الثالث", fee: 5000  },
  { id: 3, label: "قرعة عادية",   fee: 0     },
];

export const MONTHS = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

// Helper: short format → "500K" or "1M"
export function formatShort(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
  return (n / 1000).toFixed(0) + "K";
}

// Helper: full format → "500,000 د.ع"
export function formatFull(n) {
  return n.toLocaleString("ar-IQ") + " د.ع";
}

// Helper: monthly installment (amount / 10 months)
export function installment(amount) {
  return amount / 10;
}

// Helper: is this salfa locked (installment > 40% of salary)
export function isLocked(amount, salary) {
  return installment(amount) > salary * 0.4;
}
