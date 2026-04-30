import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Send as SendIcon, IndianRupee } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { saveTransaction, uid } from "@/lib/upi-store";

export const Route = createFileRoute("/send")({
  head: () => ({
    meta: [
      { title: "Send Money · UPI" },
      { name: "description", content: "Send money to any UPI ID instantly." },
    ],
  }),
  component: SendPage,
});

function SendPage() {
  const navigate = useNavigate();
  const [upiId, setUpiId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const valid = /^[\w.\-]+@[\w.\-]+$/.test(upiId) && Number(amount) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const amt = Number(amount);
    const url = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      name || "Payee"
    )}&am=${amt}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ""}`;

    saveTransaction({
      id: uid(),
      type: "send",
      upiId,
      name,
      amount: amt,
      note,
      status: "initiated",
      createdAt: Date.now(),
    });

    window.location.href = url;
    setTimeout(() => navigate({ to: "/history" }), 1200);
  };

  return (
    <main className="min-h-screen bg-background pb-24 pt-8">
      <div className="mx-auto w-full max-w-md px-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Send Money</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pay any UPI ID instantly via your UPI app.</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              UPI ID
            </label>
            <input
              type="text"
              inputMode="email"
              autoCapitalize="off"
              spellCheck={false}
              value={upiId}
              onChange={(e) => setUpiId(e.target.value.trim())}
              placeholder="name@bank"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Payee Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amount
            </label>
            <div className="relative mt-1">
              <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-lg font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Note (optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lunch, rent, etc."
              maxLength={50}
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={!valid}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendIcon className="h-5 w-5" />
            Pay Now
          </button>

          <p className="text-center text-[11px] text-muted-foreground">
            Opens your UPI app. Works on mobile devices.
          </p>
        </form>
      </div>
      <BottomNav />
    </main>
  );
}
