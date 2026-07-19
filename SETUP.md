# ScrapX — Enterprise Scrap Trading Platform

**Buy. Sell. Recycle. Professionally.**

ScrapX is a modern, enterprise-grade scrap trading platform connecting buyers and sellers of recyclable materials across India. The application is built with a 100% standalone frontend architecture utilizing structured local datasets and persistent local state (`localStorage`). No backend setup or database configuration is required!

---

## Key Features

- **Enterprise SaaS Design System**: Light-gray background, navy/blue palette, clean card layouts, crisp status badges, responsive navigation.
- **Role-Based Access Control**:
  - 👑 **Admin**: Platform KPIs, user suspension/activation, business profile verification, listing moderation, category management, analytics reports.
  - 🏭 **Seller**: Revenue area charts, pending order workflows (Accept → Pack → Ship → Deliver), listing creation with AI description auto-crafting, low-stock AI alerts.
  - 🛒 **Buyer**: Interactive scrap marketplace, category filtering, search, wishlist management, cart checkout with payment summary, purchase order tracking.
- **Local State & Persistence**: Full CRUD operations for listings, orders, users, business profiles, categories, cart, and wishlist stored locally and persisted across page refreshes.

---

## Quick Start (Zero Config)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Demo Credentials

Click any of the instant demo buttons on the login page:

| Role | Email | Password | Quick Action |
|---|---|---|---|
| 👑 Admin | `admin@scrapx.com` | `Admin@123` | Click **"👑 Admin"** on Login page |
| 🏭 Seller | `seller@scrapx.com` | `Seller@123` | Click **"🏭 Seller"** on Login page |
| 🛒 Buyer | `buyer@scrapx.com` | `Buyer@123` | Click **"🛒 Buyer"** on Login page |

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Framer Motion
- **State Management**: Zustand with `persist` middleware
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

---

## Production Build

```bash
npm run build
```

The production output is generated in the `dist/` directory, ready to deploy to Vercel, Netlify, or GitHub Pages.
