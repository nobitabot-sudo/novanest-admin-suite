import { Link } from "@tanstack/react-router";

import { formatPrice, type Product } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="card-soft card-hover group block overflow-hidden"
    >
      <div className="aspect-4/5 overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
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
