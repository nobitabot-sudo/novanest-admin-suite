import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const TABS = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/products", label: "Products", exact: false },
  { to: "/admin/orders", label: "Orders", exact: false },
  { to: "/admin/banners", label: "Offer banners", exact: false },
  { to: "/admin/settings", label: "Settings", exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-xl">
              Nova<span className="text-primary">Nest</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              {TABS.map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  activeOptions={{ exact: tab.exact }}
                  activeProps={{ className: "text-foreground font-medium" }}
                  className="transition-colors hover:text-foreground"
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Checking access…</p>
        ) : isAdmin ? (
          <Outlet />
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-8">
            <h1 className="font-display text-3xl">No admin access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This account isn't an administrator yet. Ask an existing admin to grant access.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
