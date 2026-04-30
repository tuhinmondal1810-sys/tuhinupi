import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { formatINR, saveTransaction, uid } from "@/lib/upi-store";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Payment Simulator · UPI" },
      { name: "description", content: "Demo payment simulator — no real money moves." },
    ],
  }),
  component: SimulatorPage,
});

type Phase = "idle" | "processing" | "success" | "failed";

function SimulatorPage() {
  const [upiId, setUpiId] = useState("demo@upi");
  const [amount, setAmount] = useState("99");
  const [phase, setPhase] = useState<Phase>("idle");

  const run = () => {
    if (Number(amount) <= 0) return;
    setPhase("processing");
    setTimeout(() => {
      const ok = Math.random() > 0.15;
      const next: Phase = ok ? "success" : "failed";
      setPhase(next);
      saveTransaction({
        id: uid(),
        type: "simulated",
        upiId,
        amount: Number(amount),
        status: ok ? "success" : "failed",
        createdAt: Date.now(),
        note: "Demo payment",
      });
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="mx-auto w-full max-w-md px-4">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Payment Simulator
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a fake payment flow — nothing real moves. Great for demos.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            UPI ID
          </label>
          <input
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            disabled={phase === "processing"}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Amount (INR)
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={phase === "processing"}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />

          <button
            onClick={run}
            disabled={phase === "processing"}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {phase === "processing" ? "Processing…" : "Simulate Payment"}
          </button>

          {phase !== "idle" && (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-6">
              {phase === "processing" && (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Contacting bank…</p>
                </>
              )}
              {phase === "success" && (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 animate-in zoom-in duration-300">
                    <Check className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-lg font-bold text-foreground">Payment Successful</p>
                  <p className="text-sm text-muted-foreground">
                    {formatINR(Number(amount))} sent to {upiId}
                  </p>
                </>
              )}
              {phase === "failed" && (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 animate-in zoom-in duration-300">
                    <X className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  <p className="text-lg font-bold text-foreground">Payment Failed</p>
                  <p className="text-sm text-muted-foreground">Try again in a moment.</p>
                </>
              )}
              {phase !== "processing" && (
                <button
                  onClick={() => setPhase("idle")}
                  className="mt-2 text-xs font-semibold text-primary underline"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          ⚠️ Demo only. No real bank or UPI integration is used here.
        </p>
      </div>
      <BottomNav />
    </main>
  );
}
