# FinSpace - Finance Dashboard

A clean, interactive, and fully responsive finance dashboard built with React, Vite, Zustand, and Recharts. Designed for tracking personal financial activity with an elegant dark-first UI.

---

## Preview

| Dashboard | Transactions | Insights |
|-----------|-------------|---------|
| Summary cards, area chart, pie chart, recent transactions | Filterable & sortable table, CRUD for admin, CSV/JSON export | Monthly comparison, savings rate circles, smart observations |

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + Vite | Fast HMR, modern JSX, zero config |
| State | Zustand | Lightweight, hook-based, zero boilerplate |
| Persistence | Zustand `persist` middleware | Auto localStorage sync |
| Charts | Recharts | Composable, responsive, accessible |
| Styling | Tailwind CSS v3 + CSS variables | Utility-first + theme token system |
| Icons | lucide-react | Consistent, tree-shakeable icon set |
| Animation | CSS keyframes + Tailwind utilities | No extra runtime for basic transitions |
| Typography | Syne (display) + Plus Jakarta Sans (body) + JetBrains Mono (numbers) | Finance-appropriate, distinctive |

---

## Getting Started

### Prerequisites

- Node.js **20.19+**
- npm, yarn, or pnpm

### Installation

```bash
# 1. Clone or download the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for production

```bash
npm run build
npm run preview   # preview the production build
```

---

## Project Structure

```
finance-dashboard/
├── public/
│   └── favicon.svg                  # App favicon
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── BalanceTrendChart.jsx # Area chart: income/expense/balance
│   │   │   └── SpendingPieChart.jsx  # Donut chart: category breakdown
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.jsx      # 4 KPI cards (balance, income, expenses, savings)
│   │   │   └── RecentTransactions.jsx# Latest 8 transactions widget
│   │   ├── insights/
│   │   │   └── InsightsPanel.jsx     # Full insights: KPIs, bar chart, savings circles, observations
│   │   ├── layout/
│   │   │   ├── Header.jsx            # Top bar: title, role switcher, export menu
│   │   │   └── Sidebar.jsx           # Collapsible side navigation
│   │   └── transactions/
│   │       ├── AddTransactionModal.jsx # Add/Edit form (admin only)
│   │       ├── TransactionFilters.jsx  # Search, type, category, month, sort
│   │       └── TransactionTable.jsx    # Responsive table with inline CRUD
│   ├── data/
│   │   └── mockData.js               # ~95 realistic transactions (Jan–Jun 2024)
│   ├── pages/
│   │   ├── Dashboard.jsx             # Main overview page
│   │   ├── Insights.jsx              # Analytics & patterns page
│   │   └── Transactions.jsx          # Full transaction management page
│   ├── store/
│   │   └── useStore.js               # Zustand store: state + derived selectors
│   ├── utils/
│   │   ├── exportUtils.js            # CSV & JSON export helpers
│   │   └── formatters.js             # Currency, date, percent formatters
│   ├── App.jsx                       # Root layout: sidebar + header + page routing
│   ├── index.css                     # Design system: CSS variables, component classes
│   └── main.jsx                      # React entry point
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

---

## Features

### Dashboard Overview
- **4 Summary Cards**: Net Balance (YTD), Total Income, Total Expenses, Savings Rate with trend indicators
- **Cash Flow Area Chart**: 6-month income vs expenses vs net balance with gradient fills
- **Spending Donut Chart**: Top 8 expense categories with interactive hover legends
- **Recent Transactions**: Latest 8 entries with category icons and type badges

### Transactions
- **Searchable, filterable table** — by keyword, category, type (income/expense), and month
- **Multi-column sorting** — date ascending/descending, amount high/low, alphabetical
- **Mobile-responsive** — card list view on small screens, full table on desktop
- **Row-level actions** (admin only): edit and delete with confirmation dialog
- **Footer totals** — live count and net total of filtered results

### Role-Based UI
Two roles are available via the header dropdown:

| Feature | Viewer | Admin |
|---------|--------|-------|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

Role is persisted to `localStorage` across sessions.

### Insights
- **Top spending category** — highest by total volume
- **Month-over-month expense change** — % delta vs prior month
- **Best savings month** — month with highest net balance
- **Average monthly income & expenses** — 6-month rolling averages
- **Monthly comparison bar chart** — side-by-side income vs expenses
- **Savings rate circles** — visual percentage gauge per month (deficit/fair/great)
- **Smart observations** — 5 narrative insights automatically derived from data

### State Management (Zustand)
All state lives in a single Zustand store at `src/store/useStore.js`:

- `transactions[]` — full transaction list
- `filters{}` — search, category, type, month, sortBy
- `role` — `'admin'` | `'viewer'`
- `darkMode` — boolean
- `activePage` — current page identifier

Derived data (filtered transactions, summaries, chart data) are computed as **store selectors** — no `useEffect` or `useState` needed in components.

Persistence is handled via `zustand/middleware/persist` — `transactions`, `darkMode`, and `role` survive page refreshes automatically.

### Extras
- 🌙 **Dark / Light mode** toggle with smooth CSS variable transitions
- 💾 **LocalStorage persistence** (Zustand persist middleware)
- 📤 **Export CSV & JSON** from the header dropdown
- 📱 **Fully responsive** — tested from 320px to 1440px+
- ✨ **Animations** — staggered card reveals, modal slide-up, hover transitions
- 🗑️ **Delete confirmation** modal with keyboard-safe dismiss
- 🔄 **Reset to demo data** button to restore original mock dataset

---

## Design System

The app uses a **CSS variable-based theming system** for all colors, enabling seamless light/dark switching without Tailwind class duplication.

Key design tokens:
```css
--bg-base         /* Page background */
--bg-surface      /* Sidebar/header */
--bg-card         /* Card surfaces */
--bg-elevated     /* Modals, dropdowns */
--bg-input        /* Input fields */
--border          /* Standard dividers */
--accent          /* Eva Unit 00 for Light, Eva Unit 01 for Dark */
--income          /* Green amounts */
--expense         /* Red amounts */
--text-primary    /* Body text */
--text-secondary  /* Subtitles */
--text-muted      /* Labels, metadata */
```

Typography hierarchy:
- **Display** — `Syne` (headings, page titles, card values)
- **Body** — `Plus Jakarta Sans` (paragraphs, labels, UI text)
- **Mono** — `JetBrains Mono` (all currency amounts, percentages, dates)

---

## Data

All data is static mock data defined in `src/data/mockData.js`. It includes ~95 transactions across January–June 2024 covering:

- Regular income (salary, freelance, dividends)
- Fixed expenses (rent, utilities, subscriptions)
- Variable expenses (food, shopping, travel, healthcare, education)
- 14 distinct categories with color and emoji identifiers

New transactions added via the admin form are merged into the in-memory + localStorage state and persist across reloads.

---

## Scripts

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Build for production → dist/
npm run preview   # Preview production build
```

---

## License

MIT — free to use, modify, and distribute.
