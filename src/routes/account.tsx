import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account — NovaNest" },
      { name: "description", content: "View your NovaNest profile and past orders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

type OrderRow = {
  id: string;
  created_at: string;
  total: number;
  payment_status: string;
  order_status: string;
};

function AccountPage() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth", search: { redirect: "/account" } });
        return;
      }
      setEmail(data.user.email ?? null);
      setUserId(data.user.id);

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      setIsAdmin(Boolean(roleRow));
      setCheckingAuth(false);
    });
  }, [navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, total, payment_status, order_status")
        .eq("user_id", userId as string)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as OrderRow[];
    },
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (checkingAuth) {
    return (
      <StoreLayout>
        <div className="py-24 text-center text-sm text-muted-foreground">Checking your account…</div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <h1 className="text-4xl sm:text-5xl">Your account</h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="font-medium">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="secondary">Admin panel</Button>
              </Link>
            )}
            <Button variant="outline" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>

        <h2 className="mt-10 text-2xl">Your orders</h2>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading orders…</p>
        ) : !orders || orders.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
            <Link to="/shop">
              <Button className="mt-4 rounded-full px-7">Start shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                    {order.order_status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()} · {formatPrice(Number(order.total))}
                </p>
                <p className="mt-1 text-xs capitalize text-muted-foreground">
                  Payment: {order.payment_status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
