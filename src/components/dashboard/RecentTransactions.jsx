import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export default function RecentTransactions() {
  const transactions = useStore((s) => s.transactions);
  const setActivePage = useStore((s) => s.setActivePage);

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  if (!recent.length) {
    return (
      <div className="card p-5">
        <h2 className="section-title mb-4">Recent Transactions</h2>
        <div
          className="flex flex-col items-center justify-center py-10 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          No transactions yet.
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-title">Recent Transactions</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last {recent.length} entries</p>
        </div>
        <button
          onClick={() => setActivePage('transactions')}
          className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'var(--accent)' }}
        >
          View all <ArrowRight size={13} />
        </button>
      </div>

      <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border)' }}>
        {recent.map((tx, i) => {
          const cat = CATEGORIES[tx.category] || { icon: '💰', color: '#8B5CF6' };
          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 group"
            >
              {/* Category icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 transition-transform group-hover:scale-110 duration-200"
                style={{ background: `${cat.color}18` }}
              >
                {cat.icon}
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {tx.description}
                </p>
                <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <span>{formatDate(tx.date, 'short')}</span>
                  <span>·</span>
                  <span>{tx.category}</span>
                </p>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <span
                  className={clsx(
                    'font-mono-custom font-semibold text-sm',
                    tx.type === 'income' ? 'amount-positive' : 'amount-negative',
                  )}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <div className="mt-0.5">
                  <span
                    className="badge"
                    style={{
                      background: tx.type === 'income' ? 'var(--income-bg)' : 'var(--expense-bg)',
                      color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)',
                      fontSize: '0.625rem',
                    }}
                  >
                    {tx.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
