import { Link, createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — NovaNest" },
      { name: "description", content: "Review the pieces in your NovaNest cart before checkout." },
      { property: "og:title", content: "Your cart — NovaNest" },
      { property: "og:description", content: "Review your NovaNest cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <h1 className="text-4xl sm:text-5xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="card-soft mt-8 p-10 text-center">
            <p className="text-sm text-muted-foreground">Your cart is empty right now.</p>
            <Link to="/shop">
              <Button className="mt-5 rounded-full px-7">Start shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card-soft flex gap-4 p-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-24 w-20 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => remove(item.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="h-9 w-9"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="h-9 w-9"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card-soft h-fit p-6">
              <h2 className="text-xl">Summary</h2>
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Link to="/checkout">
                <Button className="mt-6 w-full rounded-full">Proceed to checkout</Button>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
