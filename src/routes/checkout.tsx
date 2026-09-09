import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/store";
import { uploadMedia } from "@/lib/upload";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — NovaNest" },
      {
        name: "description",
        content: "Enter your delivery details and pay by UPI to place your NovaNest order.",
      },
      { property: "og:title", content: "Checkout — NovaNest" },
      { property: "og:description", content: "Delivery details and UPI payment for your order." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    utr: "",
  });

  const { data: upiId } = useQuery({
    queryKey: ["settings", "upi_id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "upi_id")
        .maybeSingle();
      if (error) throw error;
      return data?.value || "novanest@upi";
    },
    initialData: "novanest@upi",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const amount = subtotal.toFixed(2);
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=NovaNest&am=${amount}&cu=INR&tn=${encodeURIComponent("NovaNest order")}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiLink)}`;

  const placeOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!form.utr.trim() && !proofFile) {
      toast.error("Add your UPI reference (UTR) number or upload a payment screenshot.");
      return;
    }

    setSaving(true);
    try {
      let proofUrl = "";
      if (proofFile) {
        proofUrl = await uploadMedia(proofFile, "payment-proofs");
      }

      const { data: userData } = await supabase.auth.getUser();

      const fullAddress = [form.address, form.landmark, form.city, form.state]
        .filter(Boolean)
        .join(", ");

      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          phone: form.email ? `${form.phone} · ${form.email}` : form.phone,
          address: fullAddress,
          pincode: form.pincode,
          items,
          total: subtotal,
          payment_status: "pending",
          order_status: "pending",
          utr_id: form.utr.trim(),
          payment_proof_url: proofUrl,
          user_id: userData.user?.id ?? null,
        })
        .select("id")
        .single();

      if (error || !data) throw error ?? new Error("Order failed");

      clear();
      navigate({ to: "/order/$id", params: { id: data.id } });
    } catch {
      toast.error("We couldn't place your order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <h1 className="text-4xl sm:text-5xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No account needed — just fill in your details and pay by UPI.
        </p>

        {items.length === 0 ? (
          <div className="card-soft mt-8 p-10 text-center">
            <p className="text-sm text-muted-foreground">There's nothing to check out yet.</p>
            <Link to="/shop">
              <Button className="mt-5 rounded-full px-7">Browse products</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
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
                      pattern="[0-9+ ]{10,15}"
                      value={form.phone}
                      onChange={(event) => update("phone", event.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">House / street address</Label>
                  <Textarea
                    id="address"
                    required
                    rows={3}
                    value={form.address}
                    onChange={(event) => update("address", event.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark (optional)</Label>
                    <Input
                      id="landmark"
                      value={form.landmark}
                      onChange={(event) => update("landmark", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(event) => update("city", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      required
                      value={form.state}
                      onChange={(event) => update("state", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      value={form.pincode}
                      onChange={(event) => update("pincode", event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="card-soft space-y-4 p-6">
                <h2 className="text-xl">Pay {formatPrice(subtotal)} by UPI</h2>
                <p className="text-sm text-muted-foreground">
                  Scan the code or tap the button — the amount is already filled in, so you don't
                  have to type it. Then share your payment reference below.
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <img
                    src={qrSrc}
                    alt="UPI payment QR code"
                    className="h-44 w-44 rounded-xl bg-white p-2"
                  />
                  <div className="text-sm">
                    <p className="text-muted-foreground">UPI ID</p>
                    <p className="font-medium">{upiId}</p>
                    <p className="mt-2 text-muted-foreground">Amount</p>
                    <p className="font-medium">{formatPrice(subtotal)}</p>
                    <a
                      href={upiLink}
                      className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Pay in UPI app
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="utr">UPI reference / UTR number</Label>
                    <Input
                      id="utr"
                      placeholder="12-digit reference from your UPI app"
                      value={form.utr}
                      onChange={(event) => update("utr", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proof">Or upload payment screenshot</Label>
                    <Input
                      id="proof"
                      type="file"
                      accept="image/*"
                      onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  We verify your payment before dispatch. Screenshots are removed once verified.
                </p>
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
