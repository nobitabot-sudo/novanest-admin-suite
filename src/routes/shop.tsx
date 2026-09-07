import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ProductCard, ProductCardSkeleton } from "@/components/store/ProductCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActiveProducts } from "@/hooks/useProducts";
import { CATEGORIES } from "@/lib/store";

type ShopSearch = { category?: string; sort?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search['category'] === "string" ? search['category'] : undefined,
    sort: typeof search['sort'] === "string" ? search['sort'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop all products — NovaNest" },
      {
        name: "description",
        content:
          "Browse the full NovaNest collection: home decor, gadgets, kitchen, pet and lighting. Filter by category and sort by price.",
      },
      { property: "og:title", content: "Shop all products — NovaNest" },
      {
        property: "og:description",
        content: "Filter by category and sort by price across the full NovaNest collection.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const { data, isLoading } = useActiveProducts();

  const filtered = (data ?? [])
    .filter((product) => !category || product.category === category)
    .sort((a, b) => {
      if (sort === "price-asc") return Number(a.price) - Number(b.price);
      if (sort === "price-desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <h1 className="text-4xl sm:text-5xl">The collection</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isLoading ? "Loading pieces…" : `${filtered.length} pieces available`}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Select
            value={category ?? "all"}
            onValueChange={(value) =>
              navigate({
                search: (prev) => ({ ...prev, category: value === "all" ? undefined : value }),
              })
            }
          >
            <SelectTrigger className="w-45 rounded-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort ?? "featured"}
            onValueChange={(value) =>
              navigate({
                search: (prev) => ({ ...prev, sort: value === "featured" ? undefined : value }),
              })
            }
          >
            <SelectTrigger className="w-45 rounded-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)
            : filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Nothing here yet — try another category.
          </p>
        )}
      </div>
    </StoreLayout>
  );
}
