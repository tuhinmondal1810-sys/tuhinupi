import { createFileRoute } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import ownerPhoto from "@/assets/owner.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pay Tuhin Mondal · UPI" },
      { name: "description", content: "Scan to pay via UPI — RGET Innovation Technology" },
    ],
  }),
  component: Index,
});

const UPI_ID = "tuhinmondal1810-4@okaxis";
const NAME = "Tuhin Mondal";
const TITLE = "RGET Innovation Technology & Chief Automation Officer";

function Index() {
  const [copied, setCopied] = useState(false);
  const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&cu=INR`;

  const copy = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-32 relative flex flex-col items-center justify-start pt-4">
            <p className="text-white text-xs font-semibold uppercase tracking-[0.2em]">
              Secure Payment
            </p>
            <p className="text-white/90 text-sm font-medium mt-1">
              {NAME}
            </p>
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="w-28 h-28 rounded-full ring-4 ring-card overflow-hidden bg-muted shadow-xl">
                <img
                  src={ownerPhoto}
                  alt={NAME}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">{NAME}</h1>
            <p className="mt-2 text-sm text-muted-foreground uppercase tracking-wide">
              {TITLE}
            </p>

            {/* QR */}
            <div className="mt-6 inline-flex p-4 bg-white rounded-2xl shadow-md border border-border">
              <QRCodeCanvas
                value={upiUrl}
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Scan with any UPI app
            </p>

            {/* UPI ID pill */}
            <div className="mt-6 flex items-center justify-between gap-2 bg-secondary rounded-xl px-4 py-3 border border-border">
              <div className="text-left overflow-hidden">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  UPI ID
                </p>
                <p className="font-mono text-sm text-foreground truncate">
                  {UPI_ID}
                </p>
              </div>
              <button
                onClick={copy}
                className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Pay button (mobile UPI deep link) */}
            <a
              href={upiUrl}
              className="mt-4 block w-full text-center font-semibold py-3 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Pay via UPI App
            </a>
          </div>

          <div className="px-6 py-4 bg-muted/40 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground">
              Supports Google Pay · PhonePe · Paytm · BHIM
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
