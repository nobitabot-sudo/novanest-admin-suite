import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const queryClient = useQueryClient();
  const [upiId, setUpiId] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings", "upi_id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "upi_id")
        .maybeSingle();
      if (error) throw error;
      return data?.value ?? "";
    },
  });

  useEffect(() => {
    if (data !== undefined) setUpiId(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "upi_id", value: upiId }, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Payment details updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Settings</h1>

      <div className="mt-6 max-w-md rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-xl">Payment details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This UPI ID is shown to customers at checkout.
        </p>
        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="upi">UPI ID</Label>
            <Input
              id="upi"
              placeholder="yourname@upi"
              required
              disabled={isLoading}
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
}
