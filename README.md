# InvoiceBridge UAE — Frontend

React frontend for **InvoiceBridge UAE**, a multi-tenant UAE e-Invoicing integration platform.

This app talks to the existing Spring Boot backend (`invoicebridgeuae`) over REST. It does not invent APIs or mock business data.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- TanStack Query 5
- Axios
- Lucide React

## Prerequisites

- Node.js 20+ (recommended)
- Running Spring Boot backend on **http://localhost:8081**

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**.

### Useful scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

## Environment

Configured via Vite env vars (see `.env.example`):

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Axios `baseURL`. Leave **empty** in local development so requests stay same-origin and are proxied. |

Local development uses a Vite proxy (`vite.config.ts`) that forwards `/api` → `http://localhost:8081`. This avoids browser CORS issues without changing backend security.

For a direct backend URL (no proxy), set:

```env
VITE_API_BASE_URL=http://localhost:8081
```

That requires Spring Boot CORS to allow `http://localhost:5173`.

## Authentication

- Login: `POST /api/v1/auth/login`
- Profile: `GET /api/v1/profile`
- JWT stored in `localStorage` as `invoicebridge_access_token`
- Axios request interceptor sends `Authorization: Bearer <token>`
- Protected routes use `ProtectedRoute` + `AuthContext`

Logout clears the token and query cache client-side (no backend logout endpoint).

## Application routes

| Route | Description |
|---|---|
| `/login` | Sign in |
| `/register` | Placeholder registration page |
| `/dashboard` | Real counts + recent invoices |
| `/customers` | Customer list / create / edit / deactivate |
| `/customers/:id` | Customer detail |
| `/invoices` | Invoice list |
| `/invoices/new` | Create invoice |
| `/invoices/:id` | Invoice detail, validate, submit |
| `/invoices/:id/edit` | Edit invoice (allowed statuses only) |
| `/validations` | Validation overview (invoice-status based) |
| `/submissions` | Submission overview (aggregated per invoice) |
| `/asp-providers` | ASP providers + company connections |
| `/erp-integrations` | ERP integrations, test connection, sync |
| `/settings` | Authenticated profile (read-only company info gap) |

## Project structure

```text
src/
├── api/                 # Shared Axios instance + JWT interceptor
├── components/
│   ├── common/          # PageHeader, StatusBadge, Modal, Empty/Error/Loading states
│   ├── feedback/        # Toast notifications
│   └── layout/          # App shell (Sidebar, Header, MobileSidebar)
├── config/              # Shared navigation config
├── features/
│   ├── auth/
│   ├── customers/
│   ├── invoices/
│   ├── validation/
│   ├── submissions/
│   ├── asp/
│   └── erp/
├── pages/
├── routes/
├── types/ / utils/
├── App.tsx
└── main.tsx
```

Each feature typically includes:

- `types.ts` — TypeScript types matching backend DTOs
- `api/` — Axios API calls
- `hooks/` — TanStack Query hooks

## Backend integration notes

- Backend is the source of truth for fields, enums, and business rules.
- Lists are plain JSON arrays (no Spring pagination on product APIs).
- Tenant scoping is enforced by the backend via JWT `companyId` — do not send arbitrary `companyId` values from the UI.
- Invalid credentials currently may return HTTP `500` from the backend (unhandled exception), not `401`.
- There is currently **no**:
  - dashboard summary endpoint
  - global validations list endpoint
  - global submissions list endpoint
  - authenticated company profile GET endpoint

## Manual smoke test

1. Start the Spring Boot backend on port `8081`
2. Start the frontend with `npm run dev`
3. Sign in with a registered user
4. Create a customer → create an invoice → open invoice detail
5. Validate the invoice → submit when status is `VALIDATED`
6. Check Dashboard, ASP Providers, ERP Integrations, Settings
7. Refresh a protected route and confirm the session restores
8. Logout and confirm redirect to `/login`

## License

Private project — all rights reserved.
