import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — NovaNest" },
      { name: "description", content: "Enter your delivery details and pay by UPI to place your NovaNest order." },
      { property: "og:title", content: "Checkout — NovaNest" },
      { property: "og:description", content: "Delivery details and UPI payment for your order." },
    ],
  }),
  component: CheckoutPage,
});

const UPI_ID = "novanest@upi";

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth", search: { redirect: "/checkout" } });
      } else {
        setCheckingAuth(false);
      }
    });
  }, [navigate]);

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=NovaNest&am=${subtotal}&cu=INR`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: form.name,
        phone: form.phone,
        address: form.address,
        pincode: form.pincode,
        items,
        total: subtotal,
        payment_status: "pending",
        order_status: "pending",
      })
      .select("id")
      .single();
    setSaving(false);

    if (error || !data) {
      toast.error("We couldn't place your order. Please try again.");
      return;
    }
    clear();
    navigate({ to: "/order/$id", params: { id: data.id } });
  };

  if (checkingAuth) {
    return (
      <StoreLayout>
        <div className="py-24 text-center text-sm text-muted-foreground">Checking your account…</div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <h1 className="text-4xl sm:text-5xl">Checkout</h1>

        {items.length === 0 ? (
          <div className="card-soft mt-8 p-10 text-center">
            <p className="text-sm text-muted-foreground">There's nothing to check out yet.</p>
            <Link to="/shop">
              <Button className="mt-5 rounded-full px-7">Browse products</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="card-soft space-y-5 p-6">
              <h2 className="text-xl">Delivery details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    required
                    inputMode="tel"
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery address</Label>
                <Textarea
                  id="address"
                  required
                  rows={3}
                  value={form.address}
                  onChange={(event) => update("address", event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:w-48">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  required
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={(event) => update("pincode", event.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-5">
                <h3 className="text-lg">Pay by UPI</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Scan the code or open your UPI app, pay {formatPrice(subtotal)}, then place the
                  order. We verify the payment before dispatch.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-5">
                  <img
                    src={qrSrc}
                    alt="UPI payment QR code"
                    className="h-40 w-40 rounded-xl bg-white p-2"
                  />
                  <div className="text-sm">
                    <p className="text-muted-foreground">UPI ID</p>
                    <p className="font-medium">{UPI_ID}</p>
                    <a href={upiLink} className="mt-3 inline-block text-primary hover:underline">
                      Open UPI app →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <aside className="card-soft h-fit p-6">
              <h2 className="text-xl">Order summary</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.qty}
                    </span>
                    <span>{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button type="submit" disabled={saving} className="mt-6 w-full rounded-full">
                {saving ? "Placing order…" : "Place order"}
              </Button>
            </aside>
          </form>
        )}
      </div>
    </StoreLayout>
  );
                }
