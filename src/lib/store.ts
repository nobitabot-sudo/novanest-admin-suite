export const CATEGORIES = ["Home Decor", "Gadgets", "Kitchen", "Pet", "Lighting"] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  name: string;
  image_url: string;
  price: number;
  cost_price: number;
  category: string;
  description: string;
  stock: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url: string;
};

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  items: OrderItem[];
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export const ORDER_STATUSES = ["pending", "payment_verified", "shipped", "delivered"] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  payment_verified: "Payment Verified",
  shipped: "Shipped",
  delivered: "Delivered",
  paid: "Paid",
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}
