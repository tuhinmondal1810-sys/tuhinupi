import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import {
  deleteExpense,
  formatINR,
  getExpenses,
  saveExpense,
  uid,
  type Expense,
} from "@/lib/upi-store";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expense Tracker · UPI" },
      { name: "description", content: "Track your daily spending by category." },
    ],
  }),
  component: ExpensesPage,
});

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Other"] as const;

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Food");

  useEffect(() => {
    const refresh = () => setExpenses(getExpenses());
    refresh();
    window.addEventListener("upi:exp-updated", refresh);
    return () => window.removeEventListener("upi:exp-updated", refresh);
  }, []);

  const totals = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const byCat: Record<string, number> = {};
    expenses.forEach((e) => {
      byCat[e.category] = (byCat[e.category] || 0) + e.amount;
    });
    return { total, byCat };
  }, [expenses]);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || Number(amount) <= 0) return;
    saveExpense({
      id: uid(),
      title: title.trim(),
      amount: Number(amount),
      category,
      createdAt: Date.now(),
    });
    setTitle("");
    setAmount("");
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="mx-auto w-full max-w-md px-4">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Wallet className="h-6 w-6 text-primary" />
            Expense Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Log spends and see where your money goes.</p>
        </header>

        <div className="mb-5 rounded-2xl border border-border bg-gradient-to-br from-blue-600 to-purple-600 p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Total Spent</p>
          <p className="mt-1 text-3xl font-bold">{formatINR(totals.total)}</p>
          {Object.keys(totals.byCat).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(totals.byCat).map(([cat, amt]) => (
                <span
                  key={cat}
                  className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur"
                >
                  {cat} · {formatINR(amt)}
                </span>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={add}
          className="mb-5 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you spend on?"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </button>
        </form>

        {expenses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-12 text-center">
            <p className="text-sm text-muted-foreground">No expenses yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {expenses.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {e.category.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{e.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {e.category} · {new Date(e.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-foreground">{formatINR(e.amount)}</p>
                <button
                  onClick={() => deleteExpense(e.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
