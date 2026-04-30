// Local-only store for transactions and expenses (browser localStorage).

export type TxnStatus = "initiated" | "success" | "failed";

export interface Transaction {
  id: string;
  type: "send" | "receive" | "simulated";
  upiId: string;
  name?: string;
  amount: number;
  note?: string;
  status: TxnStatus;
  createdAt: number;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  createdAt: number;
}

const TXN_KEY = "upi.transactions.v1";
const EXP_KEY = "upi.expenses.v1";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getTransactions(): Transaction[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(TXN_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveTransaction(t: Transaction) {
  if (!isBrowser()) return;
  const all = getTransactions();
  all.unshift(t);
  localStorage.setItem(TXN_KEY, JSON.stringify(all.slice(0, 200)));
  window.dispatchEvent(new Event("upi:txn-updated"));
}

export function updateTransaction(id: string, patch: Partial<Transaction>) {
  if (!isBrowser()) return;
  const all = getTransactions().map((t) => (t.id === id ? { ...t, ...patch } : t));
  localStorage.setItem(TXN_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("upi:txn-updated"));
}

export function clearTransactions() {
  if (!isBrowser()) return;
  localStorage.removeItem(TXN_KEY);
  window.dispatchEvent(new Event("upi:txn-updated"));
}

export function getExpenses(): Expense[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(EXP_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveExpense(e: Expense) {
  if (!isBrowser()) return;
  const all = getExpenses();
  all.unshift(e);
  localStorage.setItem(EXP_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("upi:exp-updated"));
}

export function deleteExpense(id: string) {
  if (!isBrowser()) return;
  const all = getExpenses().filter((e) => e.id !== id);
  localStorage.setItem(EXP_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("upi:exp-updated"));
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}
