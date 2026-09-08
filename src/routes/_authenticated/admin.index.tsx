import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { formatPrice, type Order } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

function useStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) throw error;
      const orders = (data ?? []) as unknown as Order[];
      const revenue = orders
        .filter((o) => o.payment_status === "paid")
        .reduce((sum, o) => sum + Number(o.total), 0);
      const pending = orders.filter((o) => o.order_status === "pending").length;

      const counts = new Map<string, number>();
      for (const order of orders) {
        for (const item of order.items ?? []) {
          counts.set(item.name, (counts.get(item.name) ?? 0) + item.qty);
        }
      }
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
      return { total: orders.length, revenue, pending, top };
    },
  });
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const { data, isLoading } = useStats();

  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      {isLoading || !data ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Total orders" value={data.total} />
            <Stat label="Revenue (paid)" value={formatPrice(data.revenue)} />
            <Stat label="Pending orders" value={data.pending} />
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-2xl">Top selling products</h2>
            {data.top.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No sales yet.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {data.top.map(([name, qty]) => (
                  <li key={name} className="flex justify-between border-b border-border/60 pb-2">
                    <span>{name}</span>
                    <span className="text-muted-foreground">{qty} sold</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
