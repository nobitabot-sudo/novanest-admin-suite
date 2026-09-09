import { useEffect, useState } from "react";

import { useActiveBanners } from "@/hooks/useBanners";

export function OfferBanner() {
  const { data: banners } = useActiveBanners();
  const [index, setIndex] = useState(0);
  const list = banners ?? [];

  useEffect(() => {
    if (list.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(timer);
  }, [list.length]);

  if (list.length === 0) return null;

  const banner = list[index % list.length];
  if (!banner) return null;

  const content = (
    <div className="relative overflow-hidden rounded-3xl bg-muted shadow-soft">
      {banner.image_url ? (
        <img
          src={banner.image_url}
          alt={banner.title || "Offer"}
          className="h-44 w-full object-cover sm:h-64 lg:h-80"
        />
      ) : (
        <div className="h-44 w-full bg-primary/10 sm:h-64" />
      )}
      {(banner.title || banner.subtitle) && (
        <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/60 to-transparent p-5 sm:p-8">
          {banner.title && (
            <p className="text-2xl font-semibold text-white sm:text-4xl">{banner.title}</p>
          )}
          {banner.subtitle && (
            <p className="mt-1 max-w-lg text-sm text-white/85 sm:text-base">{banner.subtitle}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-5">
      {banner.link_url ? (
        <a href={banner.link_url} className="block">
          {content}
        </a>
      ) : (
        content
      )}
      {list.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {list.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show offer ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index % list.length ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
