import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { CATEGORIES, formatPrice, type Product } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

type Draft = {
  name: string;
  image_url: string;
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
      price: String(product.price),
      cost_price: String(product.cost_price),
      category: product.category,
      description: product.description,
      stock: String(product.stock),
      status: product.status,
    });
    setOpen(true);
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
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} />
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
