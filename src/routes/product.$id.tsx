import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [
      { title: "Product — NovaNest" },
      { name: "description", content: "Product details, pricing and delivery info at NovaNest." },
      { property: "og:title", content: "Product — NovaNest" },
      { property: "og:description", content: "Product details, pricing and delivery info." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product, isLoading } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const cart = useCart();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="h-96 animate-pulse rounded-3xl bg-muted" />
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-6xl px-5 py-24 text-center">
          <h1 className="text-3xl">Product not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-sm text-primary hover:underline">
            Back to shop
          </Link>
        </div>
      </StoreLayout>
    );
  }

  type MediaItem = { type: "image" | "video"; url: string };
  const media: MediaItem[] = [
    { type: "image", url: product.image_url },
    ...(product.images ?? []).map((url) => ({ type: "image" as const, url })),
    ...(product.video_url ? [{ type: "video" as const, url: product.video_url }] : []),
  ].filter((item) => item.url);
  const gallery = media.length > 0 ? media : [{ type: "image" as const, url: product.image_url }];
  const outOfStock = product.stock <= 0;

  const addToCart = () => {
    cart.add(product, qty);
    toast.success(`${product.name} added to your cart`);
  };

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 pb-28 sm:pb-10">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to shop
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="card-soft overflow-hidden">
              {gallery[active].type === "video" ? (
                <video
                  src={gallery[active].url}
                  controls
                  className="aspect-4/5 w-full bg-black object-cover"
                />
              ) : (
                <img
                  src={gallery[active].url}
                  alt={product.name}
                  className="aspect-4/5 w-full object-cover"
                />
              )}
            </div>
            <div className="mt-3 flex gap-3">
              {gallery.map((item, index) => (
                <button
                  key={item.url + index}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={item.type === "video" ? "Play video" : `View image ${index + 1}`}
                  className={`h-20 w-20 overflow-hidden rounded-xl border transition-colors ${
                    active === index ? "border-primary" : "border-border"
                  }`}
                >
                  {item.type === "video" ? (
                    <video src={item.url} muted className="h-full w-full object-cover" />
                  ) : (
                    <img src={item.url} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-semibold text-primary">
              {formatPrice(Number(product.price))}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border bg-surface">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="grid h-11 w-11 place-items-center"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((value) => value + 1)}
                  className="grid h-11 w-11 place-items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 hidden gap-3 sm:flex">
              <Button
                size="lg"
                className="rounded-full px-8"
                onClick={() => {
                  cart.add(product, qty);
                  navigate({ to: "/checkout" });
                }}
              >
                Buy now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={addToCart}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!outOfStock && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-border bg-background/95 p-4 backdrop-blur sm:hidden">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={addToCart}
          >
            Add to cart
          </Button>
          <Button
            size="lg"
            className="flex-1 rounded-full"
            onClick={() => {
              cart.add(product, qty);
              navigate({ to: "/checkout" });
            }}
          >
            Buy now
          </Button>
        </div>
      )}
    </StoreLayout>
  );
}
