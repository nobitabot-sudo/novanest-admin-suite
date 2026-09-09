import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Heart, Plus, ShieldCheck, Sofa, Cpu, ChefHat, PawPrint, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProductCard, ProductCardSkeleton } from "@/components/store/ProductCard";
import { StoreLayout } from "@/components/store/StoreLayout";
import { OfferBanner } from "@/components/store/OfferBanner";
import { Reveal } from "@/components/store/Reveal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useActiveProducts } from "@/hooks/useProducts";
import { useCart } from "@/lib/cart";
import { formatPrice, type Product } from "@/lib/store";

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

const CATEGORY_ICONS: Record<string, typeof Sofa> = {
  "Home Decor": Sofa,
  Gadgets: Cpu,
  Kitchen: ChefHat,
  Pet: PawPrint,
};

const VIBES = [
  {
    name: "Minimal",
    body: "Clean lines, quiet tones.",
    category: "Home Decor",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Cozy",
    body: "Warm light, soft textures.",
    category: "Lighting",
    image:
      "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Techy",
    body: "Sharp, functional, modern.",
    category: "Gadgets",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Playful",
    body: "A little colour, a little fun.",
    category: "Pet",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=80",
  },
];

const WHY = [
  { n: "01", title: "Free delivery", body: "On every order, anywhere in India." },
  { n: "02", title: "7-day returns", body: "Changed your mind? Send it back, no questions." },
  { n: "03", title: "Quality checked", body: "Every piece inspected before it leaves the shelf." },
];

function HomePage() {
  const { data: products, isLoading } = useActiveProducts();
  const cart = useCart();
  const list = products ?? [];
  const hero = list[0];
  const trending = list.slice(0, 8);
  const editorial = list.slice(0, 3);
  const [big, ...rest] = list.slice(0, 5);
  const smalls = rest;

  const categoryImage = (category: string) =>
    list.find((p) => p.category === category)?.image_url;

  return (
    <StoreLayout>
      {/* HERO */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-14 pt-10 lg:grid-cols-2 lg:pb-20 lg:pt-16">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">NovaNest</p>
          <h1 className="mt-4 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
            Make your space
            <br />
            feel different.
          </h1>
          <p className="mt-5 max-w-sm text-base text-muted-foreground">
            Curated objects for a better everyday.
          </p>
          <Link to="/shop" className="group mt-8 inline-flex items-center gap-2 text-base font-medium">
            <span className="rounded-full bg-foreground px-6 py-3 text-background transition-colors group-hover:bg-primary">
              Explore collection
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal delay={150} className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-6 rounded-full bg-primary/8 blur-2xl" />
            {hero ? (
              <Link
                to="/product/$id"
                params={{ id: hero.id }}
                className="relative block h-full w-full animate-[float_6s_ease-in-out_infinite]"
              >
                <img
                  src={hero.image_url}
                  alt={hero.name}
                  className="h-full w-full rounded-[2.5rem] object-cover shadow-lift"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium shadow-soft">
                  New arrival
                </span>
                <span className="absolute bottom-4 right-4 rounded-2xl bg-background/95 px-4 py-2.5 text-sm font-semibold shadow-soft">
                  {formatPrice(Number(hero.price))}
                </span>
              </Link>
            ) : (
              <div className="h-full w-full animate-pulse rounded-[2.5rem] bg-muted" />
            )}
          </div>
        </Reveal>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5">
        <OfferBanner />
      </div>

      {/* SHOP BY CATEGORY — immersive image cards */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <h2 className="text-2xl sm:text-3xl">Shop by category</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Home Decor", "Gadgets", "Kitchen", "Pet"].map((category, index) => {
            const Icon = CATEGORY_ICONS[category] ?? Sofa;
            const image = categoryImage(category);
            return (
              <Reveal key={category} delay={index * 80}>
                <Link
                  to="/shop"
                  search={{ category }}
                  className="group relative block h-64 overflow-hidden rounded-3xl bg-muted"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={category}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-secondary">
                      <Icon className="h-10 w-10 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 transition-transform duration-500 group-hover:-translate-y-1">
                    <p className="text-lg font-medium text-white">{category}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm text-white/85">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* FEATURED — editorial alternating layout */}
      {editorial.length > 0 && (
        <section className="bg-primary/5 py-20">
          <div className="mx-auto w-full max-w-6xl px-5">
            <Reveal>
              <h2 className="text-2xl sm:text-3xl">Featured pieces</h2>
            </Reveal>
            <div className="mt-10 space-y-16">
              {editorial.map((product, index) => (
                <Reveal key={product.id}>
                  <div
                    className={`grid items-center gap-8 lg:grid-cols-2 ${
                      index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <Link to="/product/$id" params={{ id: product.id }} className="block overflow-hidden rounded-3xl">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </Link>
                    <div className={index % 2 === 1 ? "lg:pr-6" : "lg:pl-6"}>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {product.category}
                      </p>
                      <h3 className="mt-3 text-3xl sm:text-4xl">{product.name}</h3>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                      <div className="mt-6 flex items-center gap-5">
                        <span className="text-2xl font-semibold text-primary">
                          {formatPrice(Number(product.price))}
                        </span>
                        <Button
                          className="rounded-full px-6"
                          onClick={() => {
                            cart.add(product, 1);
                            toast.success(`${product.name} added to your cart`);
                          }}
                        >
                          Add to cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING NOW — horizontal carousel */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal className="flex items-end justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl">Trending now</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </Reveal>
        <Reveal delay={100}>
          <Carousel opts={{ align: "start", dragFree: true }} className="mt-6">
            <CarouselContent>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <CarouselItem key={i} className="basis-[62%] sm:basis-1/3 lg:basis-1/4">
                      <ProductCardSkeleton />
                    </CarouselItem>
                  ))
                : trending.map((product) => (
                    <CarouselItem key={product.id} className="basis-[62%] sm:basis-1/3 lg:basis-1/4">
                      <TrendingCard product={product} />
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </Reveal>
      </section>

      {/* SHOP THE VIBE */}
      <section className="bg-secondary/60 py-16">
        <div className="mx-auto w-full max-w-6xl px-5">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl">Find your vibe.</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VIBES.map((vibe, index) => (
              <Reveal key={vibe.name} delay={index * 80}>
                <Link
                  to="/shop"
                  search={{ category: vibe.category }}
                  className="group relative block h-56 overflow-hidden rounded-3xl bg-muted"
                >
                  <img
                    src={vibe.image}
                    alt={vibe.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-lg font-medium text-white">{vibe.name}</p>
                    <p className="text-xs text-white/80">{vibe.body}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS — asymmetric editorial grid */}
      {big && (
        <section className="mx-auto w-full max-w-6xl px-5 py-20">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl">New arrivals</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <Link
                to="/product/$id"
                params={{ id: big.id }}
                className="group relative block h-full min-h-[420px] overflow-hidden rounded-3xl bg-muted"
              >
                <img
                  src={big.image_url}
                  alt={big.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-2xl text-white">{big.name}</p>
                  <p className="mt-1 text-lg text-white/90">{formatPrice(Number(big.price))}</p>
                </div>
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-4">
              {smalls.map((product, index) => (
                <Reveal key={product.id} delay={index * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY NOVANEST */}
      <section className="border-t border-border/70 py-16">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="grid gap-10 sm:grid-cols-3">
            {WHY.map((item, index) => (
              <Reveal key={item.n} delay={index * 100}>
                <p className="font-display text-4xl text-primary/30">{item.n}</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-medium">
                  <ShieldCheck className="h-4 w-4 text-primary" /> {item.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}

function TrendingCard({ product }: { product: Product }) {
  const cart = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="card-soft card-hover group relative overflow-hidden">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-4/5 overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="space-y-1 p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.category}</p>
          <h3 className="text-base font-medium leading-snug">{product.name}</h3>
          <div className="flex items-center gap-1 pt-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            Curated pick
          </div>
          <p className="pt-1 text-sm font-semibold text-primary">{formatPrice(Number(product.price))}</p>
        </div>
      </Link>

      <button
        type="button"
        aria-label="Wishlist"
        onClick={(event) => {
          event.preventDefault();
          setWishlisted((v) => !v);
        }}
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-soft"
      >
        <Heart className={`h-4 w-4 ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`} />
      </button>

      {product.stock > 0 && (
        <button
          type="button"
          aria-label="Quick add"
          onClick={(event) => {
            event.preventDefault();
            cart.add(product, 1);
            toast.success(`${product.name} added to your cart`);
          }}
          className="absolute bottom-[4.7rem] right-3 grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
