import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";
import { Download } from "lucide-react";
import ownerPhoto from "@/assets/owner.jpg";
import phonepeLogo from "@/assets/phonepe.png";
import gpayLogo from "@/assets/gpay.png";
import paytmLogo from "@/assets/paytm.png";
import amazonpayLogo from "@/assets/amazonpay.png";

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
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Animated transparent background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Concentric pulsing payment waves */}
        <div className="wave" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />

        {/* Orbiting rings */}
        <div className="orbit orbit-1" />
        <div className="orbit orbit-2" />
        <div className="orbit orbit-3" />

        {/* Floating sparks */}
        <span className="spark" style={{ left: "10%", animationDelay: "0s" }} />
        <span className="spark" style={{ left: "25%", animationDelay: "3s", animationDuration: "18s" }} />
        <span className="spark" style={{ left: "45%", animationDelay: "6s", animationDuration: "12s" }} />
        <span className="spark" style={{ left: "65%", animationDelay: "2s", animationDuration: "16s" }} />
        <span className="spark" style={{ left: "82%", animationDelay: "8s" }} />
        <span className="spark" style={{ left: "92%", animationDelay: "5s", animationDuration: "20s" }} />

        {/* Floating ₹ coins */}
        <span className="coin" style={{ left: "8%", animationDelay: "0s" }}>₹</span>
        <span className="coin" style={{ left: "30%", animationDelay: "4s", animationDuration: "20s" }}>₹</span>
        <span className="coin" style={{ left: "55%", animationDelay: "7s", animationDuration: "14s" }}>₹</span>
        <span className="coin" style={{ left: "75%", animationDelay: "2s", animationDuration: "18s" }}>₹</span>
        <span className="coin" style={{ left: "90%", animationDelay: "9s", animationDuration: "22s" }}>₹</span>
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-card/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-fade-in relative z-10">

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

            {/* Pay buttons — app-specific UPI deep links */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&cu=INR`}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl bg-white border border-border hover:bg-secondary transition-colors"
              >
                <img src={phonepeLogo} alt="PhonePe" width={24} height={24} loading="lazy" className="w-6 h-6 object-contain" />
                <span className="text-foreground">PhonePe</span>
              </a>
              <a
                href={`tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&cu=INR`}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl bg-white border border-border hover:bg-secondary transition-colors"
              >
                <img src={gpayLogo} alt="Google Pay" width={24} height={24} loading="lazy" className="w-6 h-6 object-contain" />
                <span className="text-foreground">Google Pay</span>
              </a>
              <a
                href={`paytmmp://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&cu=INR`}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl bg-white border border-border hover:bg-secondary transition-colors"
              >
                <img src={paytmLogo} alt="Paytm" width={24} height={24} loading="lazy" className="w-6 h-6 object-contain" />
                <span className="text-foreground">Paytm</span>
              </a>
              <a
                href={`amazonpay://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&cu=INR`}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl bg-white border border-border hover:bg-secondary transition-colors"
              >
                <img src={amazonpayLogo} alt="Amazon Pay" width={24} height={24} loading="lazy" className="w-6 h-6 object-contain" />
                <span className="text-foreground">Amazon Pay</span>
              </a>
            </div>

            <a
              href={upiUrl}
              className="mt-3 block w-full text-center font-semibold py-3 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Choose UPI App
            </a>
            <p className="mt-2 text-[10px] text-muted-foreground">
              Buttons work on mobile only. On desktop, scan the QR code above.
            </p>
          </div>

          <div className="px-6 py-4 bg-muted/40 border-t border-border text-center space-y-2">
            <Link
              to="/generator"
              className="inline-block text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              ✨ Create Custom UPI QR
            </Link>
            <p className="text-[11px] text-muted-foreground">
              Supports Google Pay · PhonePe · Paytm · BHIM
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
