import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const defaultFilters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date-desc',
  month: 'all',
};

export const useStore = create(
  persist(
    (set, get) => ({
      // ── Theme ──────────────────────────────────────────
      darkMode: true,
      toggleDarkMode: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        document.documentElement.classList.toggle('dark', next);
      },

      // ── Role ───────────────────────────────────────────
      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      // ── Page Navigation ────────────────────────────────
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),

      // ── Transactions ───────────────────────────────────
      transactions: INITIAL_TRANSACTIONS,

      addTransaction: (tx) => {
        const newTx = {
          ...tx,
          id: `tx-${Date.now()}`,
          amount: parseFloat(tx.amount),
        };
        set((s) => ({ transactions: [newTx, ...s.transactions] }));
      },

      updateTransaction: (id, updates) => {
        set((s) => ({
          transactions: s.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates, amount: parseFloat(updates.amount) } : tx
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((s) => ({
          transactions: s.transactions.filter((tx) => tx.id !== id),
        }));
      },

      resetToMockData: () => {
        set({ transactions: INITIAL_TRANSACTIONS });
      },

      // ── Filters ────────────────────────────────────────
      filters: defaultFilters,

      setFilter: (key, value) => {
        set((s) => ({ filters: { ...s.filters, [key]: value } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      // ── Derived / Selectors ────────────────────────────
      getFilteredTransactions: () => {
        const { transactions, filters } = get();
        let result = [...transactions];

        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (tx) =>
              tx.description.toLowerCase().includes(q) ||
              tx.category.toLowerCase().includes(q) ||
              tx.amount.toString().includes(q)
          );
        }

        if (filters.category !== 'all') {
          result = result.filter((tx) => tx.category === filters.category);
        }

        if (filters.type !== 'all') {
          result = result.filter((tx) => tx.type === filters.type);
        }

        if (filters.month !== 'all') {
          result = result.filter((tx) => tx.date.startsWith(filters.month));
        }

        // Sorting
        result.sort((a, b) => {
          switch (filters.sortBy) {
            case 'date-desc': return new Date(b.date) - new Date(a.date);
            case 'date-asc': return new Date(a.date) - new Date(b.date);
            case 'amount-desc': return b.amount - a.amount;
            case 'amount-asc': return a.amount - b.amount;
            case 'description': return a.description.localeCompare(b.description);
            default: return 0;
          }
        });

        return result;
      },

      getSummary: () => {
        const { transactions } = get();
        const totalIncome = transactions
          .filter((tx) => tx.type === 'income')
          .reduce((sum, tx) => sum + tx.amount, 0);
        const totalExpenses = transactions
          .filter((tx) => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
        const balance = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;
        return { totalIncome, totalExpenses, balance, savingsRate };
      },

      getMonthlyData: () => {
        const { transactions } = get();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const monthKeys = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'];

        return monthKeys.map((key, i) => {
          const monthTxs = transactions.filter((tx) => tx.date.startsWith(key));
          const income = monthTxs
            .filter((tx) => tx.type === 'income')
            .reduce((s, tx) => s + tx.amount, 0);
          const expenses = monthTxs
            .filter((tx) => tx.type === 'expense')
            .reduce((s, tx) => s + tx.amount, 0);
          return { month: months[i], income, expenses, balance: income - expenses };
        });
      },

      getCategoryBreakdown: () => {
        const { transactions } = get();
        const expenses = transactions.filter((tx) => tx.type === 'expense');
        const totals = {};
        expenses.forEach((tx) => {
          totals[tx.category] = (totals[tx.category] || 0) + tx.amount;
        });
        return Object.entries(totals)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
      },

      getInsights: () => {
        const { transactions } = get();
        const monthlyData = get().getMonthlyData();
        const categoryBreakdown = get().getCategoryBreakdown();

        const topCategory = categoryBreakdown[0] || { name: 'N/A', value: 0 };

        const avgMonthlyExpense =
          monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length || 0;
        const avgMonthlyIncome =
          monthlyData.reduce((s, m) => s + m.income, 0) / monthlyData.length || 0;

        const lastMonth = monthlyData[monthlyData.length - 1];
        const prevMonth = monthlyData[monthlyData.length - 2];
        const expenseChange = prevMonth
          ? (((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100).toFixed(1)
          : 0;

        const totalExpenses = transactions
          .filter((t) => t.type === 'expense')
          .reduce((s, t) => s + t.amount, 0);

        const topCategoryPct =
          totalExpenses > 0 ? ((topCategory.value / totalExpenses) * 100).toFixed(1) : 0;

        const bestSavingsMonth = monthlyData.reduce(
          (best, m) => (m.balance > best.balance ? m : best),
          monthlyData[0] || { month: 'N/A', balance: 0 }
        );

        const highestSingleTx = transactions
          .filter((t) => t.type === 'expense')
          .sort((a, b) => b.amount - a.amount)[0];

        return {
          topCategory,
          topCategoryPct,
          avgMonthlyExpense,
          avgMonthlyIncome,
          expenseChange,
          bestSavingsMonth,
          highestSingleTx,
          monthlyData,
        };
      },
    }),
    {
      name: 'finos-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        darkMode: state.darkMode,
        role: state.role,
      }),
    }
  )
);
