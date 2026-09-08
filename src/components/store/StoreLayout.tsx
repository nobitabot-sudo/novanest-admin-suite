import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, User } from "lucide-react";
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

  if (email) {
    return (
      <button
        type="button"
        title={`Signed in as ${email} — tap to sign out`}
        onClick={() => supabase.auth.signOut()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-accent"
      >
        <User className="h-4 w-4 text-primary" />
      </button>
    );
  }

  return (
    <Link
      to="/auth"
      aria-label="Sign in"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-accent"
    >
      <User className="h-4 w-4" />
    </Link>
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

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <AccountButton />
            <CartButton />
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface sm:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-surface px-5 py-3 sm:hidden">
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
