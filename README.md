# Pesticide Management System - Full Stack Web Application

A production-ready full-stack web application for pesticide product marketplace and management. Built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Features

### Admin Panel
- **Dashboard**: Real-time overview with sales metrics, order counts, low-stock alerts
- **Products CRUD**: Complete product management with SKU, ingredients, application info, safety guidelines
- **Categories Management**: Organize products into 10 pesticide categories
- **User Management**: View and manage user roles (admin/user)
- **Orders Management**: Track order status, update fulfillment, export CSV
- **Analytics Dashboard**: 
  - Revenue & order trends with Recharts
  - Top products by revenue
  - Conversion funnel (page view → purchase)
  - User growth metrics
  - Date range filtering (7/30/90/365 days)
  - CSV export functionality
- **Settings**: Logo upload, email templates, notification preferences, security settings

### User Panel
- **Product Catalog**: Browse 30 seeded pesticide products with search/filter by category
- **Shopping Cart**: Add to cart, update quantities, remove items
- **Checkout**: Stripe test mode integration for payments
- **Order History**: View past orders with status tracking
- **Profile Management**: Update personal information, password, preferences
- **Notifications**: Real-time order updates

### Security & Authentication
- **Supabase Auth**: Email/password authentication
- **Role-Based Access**: Admin and user roles with proper RLS policies
- **Row-Level Security**: All tables protected with appropriate policies
- **Input Validation**: Zod schemas + React Hook Form on all forms
- **Server-Side Validation**: Edge functions for write operations

### Analytics & Tracking
- **Event Tracking**: page_view, product_view, add_to_cart, checkout_start, order_complete
- **Real-time Updates**: Supabase Realtime for order notifications
- **Performance Metrics**: Revenue, conversion rates, user growth

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account (connected to this project)
- Stripe account (test mode keys)

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Context API, React Query (optional)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Backend**: Supabase (Auth, Postgres, Storage, Edge Functions)
- **Payments**: Stripe (test mode)
- **Notifications**: react-hot-toast

## 📦 Installation

### 1. Clone and Install

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. Environment Variables

The project uses Supabase Cloud with pre-configured environment variables. Keys are already set in:
- `.env` file (committed for Lovable deployment)
- `src/integrations/supabase/client.ts` (generated from Supabase)

**Important**: These are already configured:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

### 3. Database Setup

The database is already seeded with:
- ✅ 10 Product Categories
- ✅ 30 Sample Pesticide Products (with SKU, ingredients, application info)
- ✅ User roles table
- ✅ Analytics events table
- ✅ Inventory logs table

**Admin User Setup**:
1. Navigate to `/auth` and sign up with:
   - Email: `admin@gmail.com`
   - Password: `admin`
2. After signup, the migration will automatically grant admin role

### 4. Stripe Setup (Optional for Payments)

1. Get test API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Add to Supabase Secrets:
   - Navigate to: https://supabase.com/dashboard/project/macnajgqowsxlwerwtpp/settings/functions
   - Add `STRIPE_SECRET_KEY` (already configured if you set it up earlier)

### 5. Storage Bucket Setup

Product images are stored in Supabase Storage:
- Bucket name: `products`
- Public access: Enabled
- Admins can upload via Products Management

## 🏃 Development

```bash
npm run dev
```

App runs at `http://localhost:8080`

## 🔑 Default Credentials

**Admin Login**:
- Email: `admin@gmail.com`
- Password: `admin`

⚠️ **Important**: You must sign up with these credentials first, then the database migration will assign the admin role.

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── ProductsManagement.tsx
│   │   ├── CategoriesManagement.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── OrdersManagement.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   └── AdminSettings.tsx
│   ├── dashboard/
│   │   ├── AppSidebar.tsx
│   │   ├── ProfileManagement.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── CartManagement.tsx
│   │   └── UserSettings.tsx
│   └── ui/ (shadcn components)
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useCart.tsx
│   └── useProducts.tsx
├── lib/
│   ├── analytics.ts (event tracking)
│   └── utils.ts
├── pages/
│   ├── Index.tsx (public home)
│   ├── Auth.tsx (login/signup)
│   ├── Cart.tsx
│   ├── AdminDashboard.tsx
│   └── UserDashboard.tsx
└── integrations/supabase/
```

## 🗄️ Database Schema

```sql
-- Main Tables
categories (id, name, slug, created_at)
products (id, sku, name, category_id, description, ingredients, 
          application_info, safety_info, price, stock, image_url, ...)
profiles (id, email, full_name, role, phone, address, city, ...)
user_roles (id, user_id, role)
orders (id, user_id, status, total_amount, shipping_address, ...)
order_items (id, order_id, product_id, quantity, price)
cart (id, user_id, product_id, quantity)
analytics_events (id, event_name, user_id, payload, created_at)
inventory_logs (id, product_id, delta, reason, created_at)
events (id, actor_user_id, verb, object_type, object_id, metadata)
```

## 🔒 Security Features

1. **Row-Level Security (RLS)**: All tables have proper RLS policies
2. **Role-Based Access Control**: Admins and users have different permissions
3. **Input Validation**: Client-side (Zod) + Server-side (Edge Functions)
4. **Secure Admin Routes**: AuthContext checks user role before rendering
5. **Parameterized Queries**: Supabase client prevents SQL injection
6. **Password Security**: Supabase Auth handles password hashing

⚠️ **Security Warning**: Enable "Leaked Password Protection" in Supabase:
- Go to: https://supabase.com/dashboard/project/macnajgqowsxlwerwtpp/auth/providers
- Enable "Leaked Password Protection" under Password Settings

## 📊 Analytics Implementation

### Tracking Events

```typescript
import { trackEvent } from "@/lib/analytics";

// Track page views
trackEvent("page_view", { page: "/products" });

// Track product views
trackEvent("product_view", { product_id: "123", product_name: "Malathion" });

// Track add to cart
trackEvent("add_to_cart", { product_id: "123", quantity: 2 });

// Track checkout
trackEvent("checkout_start", { cart_total: 4999 });

// Track order completion
trackEvent("order_complete", { order_id: "456", total: 4999 });
```

### Admin Analytics Queries

Analytics dashboard uses server-side aggregation for performance:
- Daily revenue and order counts
- Top products by revenue
- Conversion funnel (page views → orders)
- User growth trends

## 💳 Stripe Integration

### Test Mode Setup

1. Products use Stripe checkout for payments
2. Test card: `4242 4242 4242 4242` (any future expiry, any CVC)
3. Edge function handles checkout session creation
4. Success URL: `/payment-success`
5. Cancel URL: `/payment-cancel`

### Edge Function

Location: `supabase/functions/create-payment/index.ts`

Automatically deployed to Supabase when code is pushed.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

This is a Vite + React app (not Next.js), so deployment steps differ:

1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   - Not required (already in code via Supabase integration)

4. **Custom Domain** (Optional):
   - Add in Vercel dashboard or Lovable Project Settings

### Deploy via Lovable

Simply click the **Publish** button in the top right of the Lovable editor.

Your app will be available at: `yourproject.lovable.app`

## 🧪 Testing Checklist

### Admin Flow
- [ ] Login with `admin@gmail.com` / `admin`
- [ ] View dashboard with metrics
- [ ] Create/Edit/Delete products
- [ ] Create/Edit/Delete categories
- [ ] View and update order status
- [ ] View analytics charts
- [ ] Export CSV reports
- [ ] Upload product images
- [ ] Change user roles

### User Flow
- [ ] Register new account
- [ ] Browse product catalog
- [ ] Filter products by category
- [ ] Search products
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Checkout with Stripe test card
- [ ] View order history
- [ ] Update profile
- [ ] Change password

### Real-time Features
- [ ] Admin receives toast notification when new order is placed
- [ ] Order status updates reflect immediately
- [ ] Product stock updates after purchase

## 📝 API Endpoints (Edge Functions)

All edge functions are automatically deployed to Supabase:

- `create-payment`: Creates Stripe checkout session (POST)

Additional edge functions can be added in `supabase/functions/`

## 🐛 Troubleshooting

### Issue: Can't login as admin

**Solution**: 
1. Sign up with `admin@gmail.com` / `admin` first
2. Check database: `user_roles` table should have an entry with role `admin`
3. If not, run SQL migration again

### Issue: Products not showing

**Solution**: Check RLS policies. Run:
```sql
SELECT * FROM products; -- in Supabase SQL Editor
```

### Issue: Image upload fails

**Solution**: 
1. Check Storage bucket exists: https://supabase.com/dashboard/project/macnajgqowsxlwerwtpp/storage/buckets
2. Verify bucket `products` is public
3. Check RLS policies on `storage.objects`

### Issue: Stripe checkout not working

**Solution**:
1. Verify `STRIPE_SECRET_KEY` is set in Supabase Secrets
2. Check edge function logs: https://supabase.com/dashboard/project/macnajgqowsxlwerwtpp/functions/create-payment/logs
3. Ensure you're using test mode keys (start with `sk_test_`)

### Issue: Analytics charts not showing data

**Solution**:
1. Make sure you've tracked some events using `trackEvent()`
2. Check `analytics_events` table has data
3. Verify date range filter includes event dates

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Recharts](https://recharts.org/)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

This is a Lovable-generated project. To contribute:
1. Make changes in Lovable editor or locally
2. Test thoroughly
3. Push to connected GitHub repository

## 📄 License

MIT License - Feel free to use this template for your projects.

## 👥 Support

- Lovable Community: [Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Documentation: [docs.lovable.dev](https://docs.lovable.dev/)
- Lovable Support: support@lovable.dev

---

**Built with ❤️ using Lovable, React, and Supabase**

**Project URL**: https://lovable.dev/projects/96e6fb5f-fd85-4d12-8175-965f0aab4171
