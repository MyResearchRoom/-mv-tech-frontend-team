# MV Techproducts ERP – Frontend

React + Vite + Tailwind CSS + Redux Toolkit + axios.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build
```

During development, the frontend always requests `/api`, which Vite proxies to `http://localhost:6000`; `.env.development` is optional. Update the proxy target in `vite.config.js` if your backend uses a different address. For production builds, configure `VITE_API_BASE_URL` to the API URL or same-origin API path used by your deployment.

## Folder structure (src/)
| Folder | Purpose |
|---|---|
| `api/` | axios instance (auth token + `X-Company-Id` header, 401 handling) |
| `assets/` | images, icons |
| `components/common/` | reusable UI (PageHeader, ModulePlaceholder, tables, modals…) |
| `components/feature/<module>/` | components that belong to one module |
| `components/layouts/` | MainLayout, Sidebar, Header, CompanySwitcher |
| `constants/` | route paths, sidebar menu, roles, storage keys |
| `data/` | static/demo data |
| `hooks/` | custom hooks |
| `models/` | data-shape definitions (added per module) |
| `pages/<module>/` | one folder per sidebar module |
| `routes/` | route guards (ProtectedRoute) |
| `services/` | API call functions per module |
| `store/` | Redux store + slices (auth, company, ui) |
| `utils/` | helpers |

All routes are declared in `src/App.jsx`; paths live in `constants/routePaths.js`.
To add a module: add a path in `routePaths.js`, a menu item in `sidebarMenu.js`, a page in `pages/`, and a `<Route>` in `App.jsx`.
