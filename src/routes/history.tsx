import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Sparkles, Trash2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import {
  clearTransactions,
  formatINR,
  getTransactions,
  type Transaction,
} from "@/lib/upi-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Payment History · UPI" },
      { name: "description", content: "View your UPI payment history." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [txns, setTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    const refresh = () => setTxns(getTransactions());
    refresh();
    window.addEventListener("upi:txn-updated", refresh);
    return () => window.removeEventListener("upi:txn-updated", refresh);
  }, []);

  const totalSent = txns
    .filter((t) => t.type === "send" && t.status !== "failed")
    .reduce((s, t) => s + t.amount, 0);
  const totalSimulated = txns
    .filter((t) => t.type === "simulated")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="mx-auto w-full max-w-md px-4">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">History</h1>
            <p className="mt-1 text-sm text-muted-foreground">All your transactions in one place.</p>
          </div>
          {txns.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all transaction history?")) clearTransactions();
              }}
              className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              aria-label="Clear history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </header>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Sent</p>
            <p className="mt-1 text-lg font-bold text-foreground">{formatINR(totalSent)}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Demo</p>
            <p className="mt-1 text-lg font-bold text-foreground">{formatINR(totalSimulated)}</p>
          </div>
        </div>

        {txns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {txns.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    t.type === "simulated"
                      ? "bg-purple-500/10 text-purple-500"
                      : t.type === "send"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {t.type === "simulated" ? (
                    <Sparkles className="h-5 w-5" />
                  ) : t.type === "send" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownLeft className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {t.name || t.upiId}
                  </p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {t.upiId} · {new Date(t.createdAt).toLocaleString()}
                  </p>
                  {t.note && <p className="truncate text-xs text-muted-foreground">{t.note}</p>}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatINR(t.amount)}</p>
                  <p
                    className={`text-[10px] uppercase tracking-wider ${
                      t.status === "success"
                        ? "text-green-600"
                        : t.status === "failed"
                        ? "text-red-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
