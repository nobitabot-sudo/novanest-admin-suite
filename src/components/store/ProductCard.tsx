import { Link } from "@tanstack/react-router";
import { Plus, Video } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="card-soft card-hover group relative block overflow-hidden"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {product.video_url && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
            <Video className="h-3 w-3" /> Video
          </span>
        )}

        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground px-2 py-1 text-[11px] font-medium text-background">
            Out of stock
          </span>
        )}
        {lowStock && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-1 text-[11px] font-medium text-white">
            Only {product.stock} left
          </span>
        )}

        {!outOfStock && (
          <button
            type="button"
            aria-label="Add to cart"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              cart.add(product, 1);
              toast.success(`${product.name} added to your cart`);
            }}
            className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100 sm:opacity-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-base font-medium leading-snug">{product.name}</h3>
        <p className="pt-1 text-sm font-semibold text-primary">
          {formatPrice(Number(product.price))}
        </p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-soft overflow-hidden">
      <div className="aspect-4/5 animate-pulse bg-muted" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
