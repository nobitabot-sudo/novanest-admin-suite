import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Flame, Sparkles, Lamp, Cpu, ChefHat, PawPrint, Sofa, PackageCheck, ShieldCheck, Truck } from "lucide-react";

import { ProductCard, ProductCardSkeleton } from "@/components/store/ProductCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { OfferBanner } from "@/components/store/OfferBanner";
import { Button } from "@/components/ui/button";
import { useActiveProducts } from "@/hooks/useProducts";
import { CATEGORIES } from "@/lib/store";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NovaNest — Considered objects for everyday living" },
      {
        name: "description",
        content:
          "Shop NovaNest for minimal, premium home decor, gadgets, kitchen, pet and lighting essentials. Free delivery across India.",
      },
      { property: "og:title", content: "NovaNest — Considered objects for everyday living" },
      {
        property: "og:description",
        content: "Minimal, premium essentials for home decor, gadgets, kitchen, pet and lighting.",
      },
    ],
  }),
  component: HomePage,
});

const PERKS = [
  { icon: Truck, title: "Free delivery", body: "On every order, anywhere in India." },
  { icon: ShieldCheck, title: "7-day returns", body: "Changed your mind? Send it back." },
  { icon: PackageCheck, title: "Curated stock", body: "Every piece checked before it ships." },
];

const CATEGORY_ICONS: Record<string, typeof Sofa> = {
  "Home Decor": Sofa,
  Gadgets: Cpu,
  Kitchen: ChefHat,
  Pet: PawPrint,
  Lighting: Lamp,
};

const CATEGORY_TINTS: Record<string, string> = {
  "Home Decor": "bg-rose-50",
  Gadgets: "bg-sky-50",
  Kitchen: "bg-lime-50",
  Pet: "bg-orange-50",
  Lighting: "bg-violet-50",
};

function HomePage() {
  const { data: products, isLoading } = useActiveProducts();
  const list = products ?? [];
  const featured = list.slice(0, 6);
  const newArrivals = [...list].reverse().slice(0, 6);
  const budgetPicks = list.filter((product) => Number(product.price) <= 999).slice(0, 6);

  return (
    <StoreLayout>
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
              New season edit
            </span>
            <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl">
              Considered objects for everyday living.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              A tightly edited collection of decor, gadgets and kitchen pieces — chosen for how they
              feel, not how loud they are.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg" className="rounded-full px-7">
                  Shop the collection
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop" search={{ category: "Lighting" }}>
                <Button size="lg" variant="outline" className="rounded-full px-7">
                  Browse lighting
                </Button>
              </Link>
            </div>
          </div>

          <div className="card-soft overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
              alt="A calm, minimal living room styled with NovaNest pieces"
              className="h-full max-h-[460px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <OfferBanner />

      <section className="mt-14 bg-primary/5 py-14">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {PERKS.map((perk) => (
              <div key={perk.title} className="card-soft flex items-start gap-3 p-5">
                <perk.icon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">{perk.title}</p>
                  <p className="text-sm text-muted-foreground">{perk.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl sm:text-4xl">Featured pieces</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <Carousel opts={{ align: "start", dragFree: true }} className="mt-8">
  <CarouselContent>
    {isLoading
      ? Array.from({ length: 6 }).map((_, i) => (
          <CarouselItem key={i} className="basis-[70%] sm:basis-1/2 lg:basis-1/3">
            <ProductCardSkeleton />
          </CarouselItem>
        ))
      : featured.map((product) => (
          <CarouselItem key={product.id} className="basis-[70%] sm:basis-1/2 lg:basis-1/3">
            <ProductCard product={product} />
          </CarouselItem>
        ))}
  </CarouselContent>
  <CarouselPrevious className="hidden sm:flex" />
  <CarouselNext className="hidden sm:flex" />
</Carousel>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pt-20">
        <h2 className="text-3xl sm:text-4xl">Shop by category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category] ?? Sofa;
            const tint = CATEGORY_TINTS[category] ?? "bg-surface";
            return (
              <Link
                key={category}
                to="/shop"
                search={{ category }}
                className={`card-hover flex h-32 flex-col justify-between rounded-2xl border border-border p-5 ${tint}`}
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{category}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="mt-20 bg-amber-50 py-16">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h2 className="text-3xl sm:text-4xl">New arrivals</h2>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {budgetPicks.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-16">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <h2 className="text-3xl sm:text-4xl">Under ₹999</h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {budgetPicks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </StoreLayout>
  );
}
