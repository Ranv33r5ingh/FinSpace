import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>{label} 2024</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span style={{ color: 'var(--text-secondary)' }} className="capitalize">{entry.name}:</span>
          <span className="font-mono-custom font-semibold" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrendChart() {
  const getMonthlyData = useStore((s) => s.getMonthlyData);
  const data = getMonthlyData();

  return (
    <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title">Cash Flow</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Jan – Jun 2024 · Monthly breakdown
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-income" style={{ background: 'var(--income)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Income</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--expense)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Balance</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--income)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--income)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="var(--income)"
            strokeWidth={2}
            fill="url(#incomeGrad)"
            dot={{ r: 3, fill: 'var(--income)', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--income)' }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--expense)"
            strokeWidth={2}
            fill="url(#expenseGrad)"
            dot={{ r: 3, fill: 'var(--expense)', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--expense)' }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--accent)"
            strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--accent)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
