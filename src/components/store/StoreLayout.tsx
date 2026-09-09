import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
] as const;

function CartButton() {
  const { count } = useCart();
  return (
    <Link to="/cart" className="relative inline-flex items-center" aria-label="Open cart">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-accent">
        <ShoppingBag className="h-4 w-4" />
      </span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}

function AccountButton() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <Link
      to={email ? "/account" : "/auth"}
      aria-label={email ? "Your account" : "Sign in"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-accent"
    >
      <User className={`h-4 w-4 ${email ? "text-primary" : ""}`} />
    </Link>
  );
}

function SearchBar({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  return (
    <form
      className={`relative ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        navigate({ to: "/shop", search: (prev) => ({ ...prev, search: value || undefined }) });
      }}
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search for lamps, gadgets, decor…"
        className="h-10 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm outline-none focus:border-primary"
      />
    </form>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" className="font-display text-2xl tracking-tight">
            Nova<span className="text-primary">Nest</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="shrink-0 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <SearchBar className="hidden max-w-sm flex-1 sm:block" />

          <div className="flex items-center gap-2">
            <AccountButton />
            <CartButton />
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="border-t border-border/70 px-5 py-2.5 sm:hidden">
          <SearchBar />
        </div>
        {open && (
          <div className="border-t border-border bg-surface px-5 py-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-border/70 bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl text-foreground">NovaNest</p>
            <p className="mt-1">Considered objects for everyday living.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                Shop all
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
