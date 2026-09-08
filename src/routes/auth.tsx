import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type AuthSearch = { redirect?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: typeof search['redirect'] === "string" ? search['redirect'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — NovaNest" },
      { name: "description", content: "Sign in or create your NovaNest account." },
      { property: "og:title", content: "Sign in — NovaNest" },
      { property: "og:description", content: "Sign in or create your NovaNest account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}${redirect ?? "/"}` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        let destination = redirect;
        if (!destination) {
          const { data: userData } = await supabase.auth.getUser();
          const uid = userData.user?.id;
          if (uid) {
            const { data: roleRow } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", uid)
              .eq("role", "admin")
              .maybeSingle();
            if (roleRow) destination = "/admin";
          }
        }
        navigate({ to: destination ?? "/" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-md px-5 py-20">
        <h1 className="font-display text-4xl">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to checkout faster and track your orders.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            className="w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </StoreLayout>
  );
}
