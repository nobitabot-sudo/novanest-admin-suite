import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia } from "@/lib/upload";
import { CATEGORIES, formatPrice, type Product } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

type Draft = {
  name: string;
  image_url: string;
  images: string[];
  video_url: string;
  price: string;
  cost_price: string;
  category: string;
  description: string;
  stock: string;
  status: string;
};

const EMPTY: Draft = {
  name: "",
  image_url: "",
  images: [],
  video_url: "",
  price: "",
  cost_price: "",
  category: CATEGORIES[0],
  description: "",
  stock: "0",
  status: "active",
};

function ProductsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: draft.name,
        image_url: draft.image_url,
        images: draft.images,
        video_url: draft.video_url,
        price: Number(draft.price || 0),
        cost_price: Number(draft.cost_price || 0),
        category: draft.category,
        description: draft.description,
        stock: Number(draft.stock || 0),
        status: draft.status,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setOpen(false);
      toast.success(editingId ? "Product updated" : "Product added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("products").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Product deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  function openNew() {
    setEditingId(null);
    setDraft(EMPTY);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      image_url: product.image_url,
      images: product.images ?? [],
      video_url: product.video_url ?? "",
      price: String(product.price),
      cost_price: String(product.cost_price),
      category: product.category,
      description: product.description,
      stock: String(product.stock),
      status: product.status,
    });
    setOpen(true);
  }

  async function handleCoverUpload(file: File | undefined) {
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadMedia(file, "products/cover");
      setDraft((prev) => ({ ...prev, image_url: url }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleGalleryUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, 3 - draft.images.length);
    if (files.length === 0) {
      toast.error("You can add up to 3 extra photos.");
      return;
    }
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadMedia(file, "products/gallery")));
      setDraft((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingGallery(false);
    }
  }

  async function handleVideoUpload(file: File | undefined) {
    if (!file) return;
    setUploadingVideo(true);
    try {
      const url = await uploadMedia(file, "products/video");
      setDraft((prev) => ({ ...prev, video_url: url }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploadingVideo(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl">Products</h1>
        <Button onClick={openNew}>Add product</Button>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface shadow-soft">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-border text-left text-muted-foreground">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Active</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((product) => (
                <tr key={product.id} className="border-b border-border/60 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{product.category}</td>
                  <td className="p-4">{formatPrice(Number(product.price))}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <Switch
                      checked={product.status === "active"}
                      onCheckedChange={(checked) =>
                        toggleStatus.mutate({
                          id: product.id,
                          status: checked ? "active" : "inactive",
                        })
                      }
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => remove.mutate(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              save.mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Cover photo</Label>
              <div className="flex items-center gap-3">
                {draft.image_url && (
                  <img src={draft.image_url} alt="Cover" className="h-14 w-14 rounded-lg object-cover" />
                )}
                <Input
                  id="image"
                  placeholder="Paste a URL or upload"
                  value={draft.image_url}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                />
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingCover}
                  onClick={() => coverInputRef.current?.click()}
                >
                  {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Extra photos ({draft.images.length}/3)</Label>
              <div className="flex flex-wrap items-center gap-3">
                {draft.images.map((url, index) => (
                  <div key={url} className="relative">
                    <img src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute -right-1 -top-1 rounded-full bg-foreground p-0.5 text-background"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {draft.images.length < 3 && (
                  <>
                    <input
                      ref={galleryInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleGalleryUpload(e.target.files)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingGallery}
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add photos"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product video (optional)</Label>
              {draft.video_url && (
                <video src={draft.video_url} controls className="h-32 rounded-lg" />
              )}
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Paste a URL or upload"
                  value={draft.video_url}
                  onChange={(e) => setDraft({ ...draft, video_url: e.target.value })}
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoUpload(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingVideo}
                  onClick={() => videoInputRef.current?.click()}
                >
                  {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" min="0" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost price</Label>
                <Input id="cost" type="number" min="0" value={draft.cost_price} onChange={(e) => setDraft({ ...draft, cost_price: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={draft.category} onValueChange={(value) => setDraft({ ...draft, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" min="0" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3">
              <Label htmlFor="active">Active in store</Label>
              <Switch
                id="active"
                checked={draft.status === "active"}
                onCheckedChange={(checked) => setDraft({ ...draft, status: checked ? "active" : "inactive" })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
