# App Graph Builder

A responsive "App Graph Builder" UI built with React, ReactFlow, TanStack Query, and Zustand. Matches the supertokens-style service topology dashboard.

## 🚀 Setup

```bash
# Install dependencies
npm install

# Initialize MSW service worker (required for mock API)
npx msw init public/ --save

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## 📦 Deploying to Vercel

```bash
# Build
npm run build

# Or push to GitHub and connect to Vercel
# Vercel auto-detects Vite — no config needed
```

> **MSW note for Vercel:** The `mockServiceWorker.js` in `/public` is committed and served. MSW only activates in `DEV` mode (`import.meta.env.DEV`). In production, you'd wire real API endpoints.

## 🔧 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict check |

## 🏗 Architecture

```
src/
  types/          — shared TypeScript types
  store/          — Zustand (selectedAppId, selectedNodeId, mobilePanelOpen, activeTab)
  mocks/          — MSW handlers (GET /api/apps, GET /api/apps/:id/graph)
  hooks/          — TanStack Query (useApps, useGraph)
  components/
    layout/       — TopBar, LeftRail, RightPanel
    canvas/       — AppCanvas (ReactFlow), ServiceNode (custom node)
    inspector/    — NodeInspector (tabs, slider, fields)
    ui/           — shadcn/ui primitives (Badge, Button, Input, Slider, Tabs, Sheet, Skeleton)
  lib/            — cn() utility
```

## 🎯 Key Decisions

- **MSW for mocking** — intercepts real fetch calls; swappable with real endpoints without touching component code
- **Zustand for UI state only** — server data lives in TanStack Query cache; Zustand only owns selection + mobile state
- **Custom ServiceNode** — matches the screenshot card design (price badge, resource tabs, gradient slider, status badge, provider logo)
- **Keyboard delete** — Delete/Backspace removes selected node + its edges
- **Mobile drawer** — `Sheet` from Radix Dialog; `isMobilePanelOpen` controlled via Zustand

## ⚠️ Known Limitations

- MSW requires `npx msw init public/` to copy the service worker on first setup
- Node resource value edits via inspector don't persist across app switches (no backend)
- The `updateNodeRef` pattern is a workaround for ReactFlow's controlled mode — a `useImperativeHandle` refactor would be cleaner
