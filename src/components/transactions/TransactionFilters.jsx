import { useStore } from '../../store/useStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/mockData';
import { AVAILABLE_MONTHS } from '../../utils/formatters';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest)' },
  { value: 'date-asc', label: 'Date (Oldest)' },
  { value: 'amount-desc', label: 'Amount (High)' },
  { value: 'amount-asc', label: 'Amount (Low)' },
  { value: 'description', label: 'Name (A–Z)' },
];

export default function TransactionFilters() {
  const { filters, setFilter, resetFilters } = useStore();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.month !== 'all';

  return (
    <div className="card p-4 animate-fade-in">
      {/* Top row: search + toggle */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="input-base pl-8"
          />
          {filters.search && (
            <button
              onClick={() => setFilter('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className="btn-ghost flex items-center gap-1.5 shrink-0 relative"
        >
          <SlidersHorizontal size={14} />
          <span className="text-xs hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              style={{ background: 'var(--accent)' }}
            />
          )}
        </button>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilter('sortBy', e.target.value)}
          className="select-base shrink-0 text-xs"
          style={{ width: 'auto', minWidth: 140 }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mt-3 pt-3 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Type */}
          <div>
            <label className="label-base">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilter('type', e.target.value)}
              className="select-base text-xs"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="label-base">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className="select-base text-xs"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="label-base">Month</label>
            <select
              value={filters.month}
              onChange={(e) => setFilter('month', e.target.value)}
              className="select-base text-xs"
            >
              <option value="all">All Months</option>
              {AVAILABLE_MONTHS.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <button onClick={resetFilters} className="btn-ghost w-full text-xs flex items-center justify-center gap-1.5">
                <X size={13} /> Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
