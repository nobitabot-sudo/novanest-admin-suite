import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { StoreLayout } from "@/components/store/StoreLayout";
import { Button } from "@/components/ui/button";
import { shortId } from "@/lib/store";

export const Route = createFileRoute("/order/$id")({
  head: () => ({
    meta: [
      { title: "Order confirmed — NovaNest" },
      { name: "description", content: "Thank you for your NovaNest order. Here are your order details." },
      { property: "og:title", content: "Order confirmed — NovaNest" },
      { property: "og:description", content: "Thank you for your NovaNest order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-xl px-5 py-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-6 text-4xl">Thank you</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your order is placed. We'll verify your UPI payment and start packing right away — you'll
          get a call on the number you shared.
        </p>

        <div className="card-soft mt-8 p-6 text-left">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Order ID</p>
          <p className="mt-1 font-mono text-lg">#{shortId(id)}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Payment status: <span className="text-foreground">Pending verification</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Order status: <span className="text-foreground">Pending</span>
          </p>
        </div>

        <Link to="/shop">
          <Button className="mt-8 rounded-full px-8">Continue shopping</Button>
        </Link>
      </div>
    </StoreLayout>
  );
}
