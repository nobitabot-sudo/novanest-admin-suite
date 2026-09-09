import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { Banner } from "@/lib/store";
import { uploadMedia } from "@/lib/upload";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  component: BannersPage,
});

const EMPTY = { image_url: "", title: "", subtitle: "", link_url: "", sort_order: "0" };

function BannersPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState({ ...EMPTY });
  const [uploading, setUploading] = useState(false);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });
    queryClient.invalidateQueries({ queryKey: ["banners"] });
  };

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("banners").insert({
        image_url: draft.image_url,
        title: draft.title,
        subtitle: draft.subtitle,
        link_url: draft.link_url,
        sort_order: Number(draft.sort_order || 0),
        active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setDraft({ ...EMPTY });
      toast.success("Offer banner added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("banners").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Banner removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadMedia(file, "banners");
      setDraft((prev) => ({ ...prev, image_url: url }));
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl">Offer banners</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        These show at the top of the homepage. Upload a photo or paste an image link.
      </p>

      <form
        className="mt-6 grid max-w-3xl gap-4 rounded-2xl border border-border bg-surface p-6 shadow-soft sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          add.mutate();
        }}
      >
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="banner-file">Upload photo</Label>
          <Input
            id="banner-file"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="banner-url">Image link</Label>
          <Input
            id="banner-url"
            required
            value={draft.image_url}
            onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-title">Offer title</Label>
          <Input
            id="banner-title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-sub">Subtitle</Label>
          <Input
            id="banner-sub"
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-link">Link (optional)</Label>
          <Input
            id="banner-link"
            placeholder="/shop"
            value={draft.link_url}
            onChange={(e) => setDraft({ ...draft, link_url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="banner-order">Order</Label>
          <Input
            id="banner-order"
            type="number"
            value={draft.sort_order}
            onChange={(e) => setDraft({ ...draft, sort_order: e.target.value })}
          />
        </div>
        <Button type="submit" className="sm:col-span-2" disabled={add.isPending || uploading}>
          {uploading ? "Uploading…" : add.isPending ? "Saving…" : "Add banner"}
        </Button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          (banners ?? []).map((banner) => (
            <div key={banner.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              {banner.image_url && (
                <img src={banner.image_url} alt={banner.title} className="h-40 w-full object-cover" />
              )}
              <div className="space-y-2 p-4">
                <p className="font-medium">{banner.title || "Untitled offer"}</p>
                <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Switch
                      checked={banner.active}
                      onCheckedChange={(checked) => toggle.mutate({ id: banner.id, active: checked })}
                    />
                    <span className="text-muted-foreground">Visible</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => remove.mutate(banner.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
