# NovaNest Admin Suite

Build a minimal, premium-feeling e-commerce dropshipping store called "NovaNest" 

using React + Tailwind + Supabase.



STOREFRONT PAGES:

1. Homepage - hero section with tagline, featured products grid (4-6 cards), 

   category section (Home Decor, Gadgets, Kitchen, Pet, Lighting)

2. Product Listing Page - grid layout, filter by category, sort by price

3. Product Detail Page - image gallery, title, price, description, quantity 

   selector, "Buy Now" and "Add to Cart" buttons

4. Cart Page - list of items with quantity edit, remove option, subtotal, 

   "Proceed to Checkout" button

5. Checkout Page - form for name, phone, address, pincode, and a UPI QR code 

   / payment link section, "Place Order" button

6. Order Confirmation Page - order ID, summary, "Thank you" message



Design style: clean, modern, minimal — white/soft background, one accent 

color (deep purple/indigo), rounded cards, subtle shadows, mobile-first 

responsive design, smooth hover animations on product cards.



DATABASE (Supabase):

- products table (id, name, image_url, price, cost_price, category, 

  description, stock, status)

- orders table (id, customer_name, phone, address, pincode, items, total, 

  payment_status, order_status, created_at)



STOREFRONT FUNCTIONALITY:

- Products load dynamically from Supabase products table (only "active" status)

- Cart state managed with React context, persisted in localStorage

- On checkout, order gets saved to Supabase orders table with payment_status 

  "pending"



ADMIN PANEL at /admin route, password protected (simple login with one admin 

email/password via Supabase auth):



1. Product Management page:

   - Table view of all products (image thumbnail, name, category, price, 

     stock, status)

   - "Add New Product" form: name, image URL, category (dropdown), cost price, 

     selling price, description, stock quantity

   - Edit and Delete option on each row

   - Toggle Active/Inactive status



2. Orders Management page:

   - Table of all orders (order ID, customer name, phone, address, items, 

     total, payment status, order status, date)

   - "Mark as Paid" button (manual UPI verification workflow)

   - Dropdown to update order status: Pending, Payment Verified, Shipped, 

     Delivered



3. Dashboard page (default admin landing):

   - Total orders, total revenue, pending orders count, top selling products



Only logged-in admin can access /admin routes — redirect to login page if 

not authenticated.



Keep code clean and componentized for easy future edits.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/86ee30d7-577d-4a37-9ac2-145ae83a62a7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
