import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_STATUSES, STATUS_LABELS, formatPrice, shortId, type Order } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, string> }) => {
      const { error } = await supabase.from("orders").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Order updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Orders</h1>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (orders ?? []).length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {(orders ?? []).map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    #{shortId(order.id)} · {order.customer_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.phone} · {order.address}, {order.pincode}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <p className="font-display text-2xl">{formatPrice(Number(order.total))}</p>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {(order.items ?? []).map((item) => (
                  <li key={item.id}>
                    {item.qty} × {item.name} — {formatPrice(item.price * item.qty)}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-border px-3 py-1 text-xs">
                  Payment: {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                </span>
                {order.payment_status !== "paid" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      update.mutate({
                        id: order.id,
                        patch: { payment_status: "paid", order_status: "payment_verified" },
                      })
                    }
                  >
                    Mark as paid
                  </Button>
                )}
                <Select
                  value={order.order_status}
                  onValueChange={(value) => update.mutate({ id: order.id, patch: { order_status: value } })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
