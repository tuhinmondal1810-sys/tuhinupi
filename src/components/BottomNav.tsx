import { Link } from "@tanstack/react-router";
import { Home, Send, History, Wallet, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/send", label: "Send", Icon: Send },
  { to: "/history", label: "History", Icon: History },
  { to: "/expenses", label: "Expenses", Icon: Wallet },
  { to: "/simulator", label: "Demo", Icon: Sparkles },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ to, label, Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:text-primary"
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
