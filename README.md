# 🍽️ Restro — Restaurant Management System (Frontend)

> The Angular admin dashboard for the Rest restaurant management platform. Gives
> Admins and Chefs a real-time, role-aware interface for managing staff, the menu,
> incoming orders, deliveries, and payments — backed by a Clean Architecture ASP.NET
> Core API.

## 📌 Project Status

Actively developed. Backend integration, role-based routing, and the core
Staff/Categories/Dishes/Orders modules are functionally complete, including a custom
Power BI-style analytics dashboard for Admins. See [Roadmap](#-roadmap--known-issues)
for what's next.

## 🧱 Tech Stack

| Area | Technology |
|---|---|
| Framework | Angular 19 (standalone components — no NgModules) |
| Reactive data flow | RxJS (Observables, operators: `debounceTime`, `distinctUntilChanged`, `takeUntil`, `finalize`, `tap`) |
| UI Kit | MDB UI Kit (Material Design Bootstrap) |
| Charts | Chart.js |
| Notifications | ngx-toastr |
| Confirmations | SweetAlert2 |
| HTTP | Angular `HttpClient` + custom interceptor pipeline |

## 🏗️ Architecture

Feature-based folder structure — every domain feature is self-contained with the same
internal shape, so navigating any feature is predictable:

```
src/app/
├── Core/               # Cross-cutting concerns: auth, guards, interceptors, base API service
├── features/
│   └── <feature>/
│       ├── models/       # Request/response DTOs (mirrors the backend's DTO split)
│       ├── services/      # HTTP calls for this feature
│       ├── components/    # Presentational + smart components
│       └── pages/          # Route-level container components
├── layouts/             # Dashboard shell, main layout
└── shared/              # Reusable components & helpers used across features
```

### HTTP Pipeline

Every request passes through three chained interceptors, in this order:

1. **Auth** — attaches the JWT bearer token
2. **Error Handling** — 401 → logout + redirect; 403/network/5xx → toast notification;
   400/404 passed through for component-level handling
3. **Response Unwrapping** — strips the backend's `ApiResponse<T> { success, data }`
   envelope so every service works with `T` directly, not the wrapper

### Role-Based Access

A generic `rolesGuard` reads allowed roles straight from route metadata, so adding a
new role to an existing route is a one-line change rather than a new guard. The Admin
dashboard Overview page is split at the *component* level per role
(`AdminOverviewComponent` / `ChefOverviewComponent`) rather than one component
branching internally — better bundle size, testability, and separation of concerns.

## ✨ Features

- 🔐 **JWT-based auth** with automatic session handling and role-aware routing
- 👥 **Staff management** — add/edit/archive users with role-specific fields (Chef
  specialization, DeliveryPerson vehicle info), image upload with client-side
  validation
- 🍔 **Menu management** — categories and dishes with live availability toggles,
  discount pricing, promotion flags, image previews
- 📦 **Order management** — role-aware action buttons (a Chef sees different actions
  than an Admin) driven by a shared state-machine helper that mirrors the backend's
  allowed transitions
- 🚚 **Delivery assignment** — auto-assign or manually pick an available delivery
  person for orders that are ready
- 💳 **Payment tracking & refunds** per order
- 📊 **Custom analytics dashboard** for Admins — KPI cards, a revenue trend line
  chart, and an order-status breakdown doughnut chart,
  built on a single reusable `ChartCardComponent` wrapping Chart.js
- 📱 **Fully responsive** — CSS Grid layouts with `ResizeObserver`-driven chart
  resizing (reacts correctly to sidebar collapse and breakpoint changes, not just
  browser window resizes)

## 🎨 Design Conventions

- **Rule of Three** — nothing gets extracted into a shared helper or component until
  the same pattern shows up a third time in real code (applied to confirm-dialog
  boilerplate, file-upload validation, and shared CSS animations)
- **Consistent read/write model split** mirroring the backend's DTO conventions
- A single design-token system (CSS custom properties) drives color, spacing, and
  status-badge styling across every feature

## 🗺️ Roadmap / Known Issues

- [ ] No refresh-token flow yet — any 401 forces a full re-login
- [ ] Dedicated mobile-first layout for the DeliveryPerson role (deliberately
      deferred — their workflow is fundamentally different from the Admin/Chef
      desktop dashboard)

## 🚀 Running Locally

```bash
npm install
ng serve
```

Point `src/environments/environment.ts` at your local backend instance
(`apiBaseUrl`, `assetsBaseUrl`).

## 🔗 Related

Backend (ASP.NET Core 9, Clean Architecture): see the companion `Restaurant-Management-API`
repository.
