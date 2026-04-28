import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/generator")({
  head: () => ({
    meta: [
      { title: "UPI QR Generator — Create Custom Payment QR Codes" },
      {
        name: "description",
        content:
          "Generate a custom UPI payment QR code with name, UPI ID, amount and note. Download as PNG or copy the UPI link instantly.",
      },
    ],
  }),
  component: Generator,
});

type Errors = Partial<Record<"name" | "upiId" | "amount", string>>;

const PERMANENT_UPI_ID = "tuhinmondal1810-4@okaxis";

function Generator() {
  const [name, setName] = useState("");
  const [upiId] = useState(PERMANENT_UPI_ID);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  // Dark mode toggle (scoped via class on root)
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) next.name = "Name is required";
    else if (name.length > 100) next.name = "Name too long";

    const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiId.trim()) next.upiId = "UPI ID is required";
    else if (!upiRegex.test(upiId.trim()))
      next.upiId = "Invalid UPI ID (e.g. name@okaxis)";

    if (amount.trim()) {
      const num = Number(amount);
      if (Number.isNaN(num) || num <= 0) next.amount = "Amount must be a positive number";
      else if (num > 100000) next.amount = "Amount too large";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildLink = (amt?: string) => {
    const params = new URLSearchParams();
    params.set("pa", upiId.trim());
    params.set("pn", name.trim());
    const a = (amt ?? amount).trim();
    if (a) params.set("am", a);
    params.set("cu", "INR");
    if (note.trim()) params.set("tn", note.trim());
    return `upi://pay?${params.toString()}`;
  };

  const onGenerate = () => {
    if (!validate()) return;
    setGenerated(buildLink());
  };

  const onQuick300 = () => {
    setAmount("300");
    // validate against current values but force amount=300
    const next: Errors = {};
    if (!name.trim()) next.name = "Name is required";
    const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
    if (!upiId.trim()) next.upiId = "UPI ID is required";
    else if (!upiRegex.test(upiId.trim()))
      next.upiId = "Invalid UPI ID (e.g. name@okaxis)";
    setErrors(next);
    if (Object.keys(next).length === 0) setGenerated(buildLink("300"));
  };

  const onCopy = async () => {
    if (!generated) return;
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onDownload = () => {
    const canvas = qrWrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `upi-qr-${(name || "payment").replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onReset = () => {
    setName("");
    setAmount("");
    setNote("");
    setErrors({});
    setGenerated(null);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="animated-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="w-full max-w-3xl relative">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="text-sm font-semibold px-3 py-2 rounded-lg bg-card/85 backdrop-blur border border-white/40 hover:bg-card transition-colors"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="bg-card/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-6 text-center">
            <h1 className="text-2xl font-bold text-white">UPI QR Generator</h1>
            <p className="text-white/90 text-sm mt-1">
              Create a custom payment QR in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Form */}
            <div className="space-y-4">
              <Field
                label="Receiver Name"
                value={name}
                onChange={setName}
                placeholder="Tuhin Mondal"
                error={errors.name}
                maxLength={100}
              />
              <Field
                label="UPI ID"
                value={upiId}
                onChange={() => undefined}
                placeholder="name@okaxis"
                error={errors.upiId}
                maxLength={256}
                readOnly
              />
              <Field
                label="Amount (₹)"
                value={amount}
                onChange={setAmount}
                placeholder="Optional"
                error={errors.amount}
                type="number"
              />
              <Field
                label="Note / Description"
                value={note}
                onChange={setNote}
                placeholder="Optional message"
                maxLength={120}
              />

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={onGenerate}
                  className="w-full font-semibold py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md"
                >
                  Generate QR Code
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onQuick300}
                    className="font-semibold py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90 transition-opacity shadow"
                  >
                    ₹300 Quick Generate
                  </button>
                  <button
                    onClick={onReset}
                    className="font-semibold py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* QR preview */}
            <div className="flex flex-col items-center justify-center bg-secondary/40 rounded-2xl p-6 border border-border">
              {generated ? (
                <>
                  <div ref={qrWrapRef} className="p-4 bg-white rounded-2xl shadow-md">
                    <QRCodeCanvas value={generated} size={220} level="H" includeMargin />
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground text-center">
                    Scan with any UPI app
                  </p>

                  <div className="mt-4 w-full break-all text-[11px] font-mono bg-background/60 rounded-lg p-2 border border-border text-foreground/80">
                    {generated}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 w-full">
                    <button
                      onClick={onDownload}
                      className="font-semibold py-2.5 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity"
                    >
                      ⬇ Download PNG
                    </button>
                    <button
                      onClick={onCopy}
                      className="font-semibold py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {copied ? "✓ Copied" : "📋 Copy Link"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <div className="text-5xl mb-3">📱</div>
                  <p className="text-sm">
                    Fill in the details and click <b>Generate QR Code</b>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-muted/40 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground">
              Works with Google Pay · PhonePe · Paytm · BHIM · Amazon Pay
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  maxLength,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  maxLength?: number;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => !readOnly && onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={type === "number" ? "decimal" : undefined}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        readOnly={readOnly}
        className={`w-full h-11 rounded-xl border bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          error ? "border-destructive" : "border-input"
        }`}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}
