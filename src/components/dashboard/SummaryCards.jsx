import { useStore } from '../../store/useStore';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { clsx } from 'clsx';

const CARDS = [
  {
    key: 'balance',
    label: 'Net Balance',
    icon: Wallet,
    colorVar: '--accent',
    bgVar: '--accent-dim',
    format: (v) => formatCurrency(v),
    trend: null,
  },
  {
    key: 'totalIncome',
    label: 'Total Income',
    icon: TrendingUp,
    colorVar: '--income',
    bgVar: '--income-bg',
    format: (v) => formatCurrency(v),
  },
  {
    key: 'totalExpenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    colorVar: '--expense',
    bgVar: '--expense-bg',
    format: (v) => formatCurrency(v),
  },
  {
    key: 'savingsRate',
    label: 'Savings Rate',
    icon: PiggyBank,
    colorVar: '--neon-purple',
    bgVar: null,
    format: (v) => `${v}%`,
    isPercent: true,
  },
];

function SummaryCard({ card, value, index }) {
  const Icon = card.icon;
  const isExpense = card.key === 'totalExpenses';
  const isSavings = card.key === 'savingsRate';
  const savingsGood = isSavings && parseFloat(value) >= 20;
  const savingsBad = isSavings && parseFloat(value) < 10;

  const accentColor = isSavings
    ? savingsGood ? 'var(--income)' : savingsBad ? 'var(--expense)' : 'var(--neon-purple)'
    : `var(${card.colorVar})`;

  const accentBg = isSavings
    ? savingsGood ? 'var(--income-bg)' : savingsBad ? 'var(--expense-bg)' : 'rgba(167,139,250,0.12)'
    : card.bgVar ? `var(${card.bgVar})` : 'rgba(167,139,250,0.12)';

  return (
    <div
      className="card p-5 cursor-default group transition-all duration-200 animate-slide-up"
      style={{
        animationDelay: `${index * 0.07}s`,
        opacity: 0,
        animation: `slideUp 0.4s ease ${index * 0.07}s forwards`,
      }}
    >
      {/* Icon row */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: accentBg }}
        >
          <Icon size={17} style={{ color: accentColor }} />
        </div>
        {card.key === 'balance' && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
          >
            YTD
          </span>
        )}
        {isSavings && (
          <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: accentColor }}>
            {savingsGood ? <ArrowUpRight size={13} /> : savingsBad ? <ArrowDownRight size={13} /> : null}
            {savingsGood ? 'Healthy' : savingsBad ? 'Low' : 'Fair'}
          </div>
        )}
      </div>

      {/* Value */}
      <div
        className="metric-value leading-none mb-1"
        style={{
          color: accentColor,
          fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
        }}
      >
        {card.format(value)}
      </div>

      {/* Label */}
      <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
        {card.label}
      </p>

      {/* Bar indicator */}
      {isSavings && (
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(parseFloat(value), 100)}%`,
              background: accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function SummaryCards() {
  const getSummary = useStore((s) => s.getSummary);
  const { totalIncome, totalExpenses, balance, savingsRate } = getSummary();

  const values = { totalIncome, totalExpenses, balance, savingsRate };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card, i) => (
        <SummaryCard key={card.key} card={card} value={values[card.key]} index={i} />
      ))}
    </div>
  );
}
