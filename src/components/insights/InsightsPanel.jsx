import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Zap, Trophy, Target,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>{label} 2024</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span style={{ color: 'var(--text-secondary)' }} className="capitalize">{p.name}:</span>
          <span className="font-mono-custom font-semibold" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

function InsightCard({ icon: Icon, title, value, sub, accent, trend, delay }) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  return (
    <div
      className="card p-5 animate-slide-up"
      style={{ animationDelay: delay, opacity: 0, animation: `slideUp 0.4s ease ${delay} forwards` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18` }}
        >
          <Icon size={17} style={{ color: accent }} />
        </div>
        {trend && (
          <TrendIcon size={16} style={{ color: accent }} />
        )}
      </div>
      <div className="metric-value text-xl leading-none mb-1" style={{ color: accent }}>
        {value}
      </div>
      <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
  );
}

function ObservationCard({ text, icon, color, delay }) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl animate-fade-in"
      style={{
        background: `${color}10`,
        border: `1px solid ${color}25`,
        animationDelay: delay,
      }}
    >
      <span className="text-lg shrink-0 mt-0.5">{icon}</span>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  );
}

export default function InsightsPanel() {
  const getInsights = useStore((s) => s.getInsights);
  const {
    topCategory, topCategoryPct,
    avgMonthlyExpense, avgMonthlyIncome,
    expenseChange, bestSavingsMonth,
    highestSingleTx, monthlyData,
  } = getInsights();

  const topCat = CATEGORIES[topCategory.name] || { icon: '💰', color: '#8B5CF6' };
  const expChangeNum = parseFloat(expenseChange);
  const expTrend = expChangeNum > 5 ? 'up' : expChangeNum < -5 ? 'down' : null;
  const savingsRateAvg = avgMonthlyIncome > 0
    ? (((avgMonthlyIncome - avgMonthlyExpense) / avgMonthlyIncome) * 100).toFixed(1)
    : '0';

  const observations = [
    {
      icon: topCat.icon,
      color: topCat.color,
      text: `Your biggest spending category is ${topCategory.name}, making up ${topCategoryPct}% of total expenses (${formatCurrency(topCategory.value)}).`,
    },
    {
      icon: '📅',
      color: 'var(--accent)',
      text: `On average, you spend ${formatCurrency(avgMonthlyExpense)} per month and earn ${formatCurrency(avgMonthlyIncome)} — a monthly surplus of ${formatCurrency(avgMonthlyIncome - avgMonthlyExpense)}.`,
    },
    {
      icon: expChangeNum > 0 ? '⚠️' : '✅',
      color: expChangeNum > 0 ? 'var(--expense)' : 'var(--income)',
      text: expChangeNum > 0
        ? `Expenses increased by ${Math.abs(expChangeNum)}% last month compared to the previous. Consider reviewing discretionary spending.`
        : `Great news — expenses decreased by ${Math.abs(expChangeNum)}% last month. You're trending in the right direction!`,
    },
    {
      icon: '🏆',
      color: 'var(--income)',
      text: `Your best savings month was ${bestSavingsMonth.month} with a net balance of ${formatCurrency(bestSavingsMonth.balance)}.`,
    },
    highestSingleTx && {
      icon: '💸',
      color: 'var(--expense)',
      text: `Your single largest expense was "${highestSingleTx.description}" at ${formatCurrency(highestSingleTx.amount)} in the ${highestSingleTx.category} category.`,
    },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InsightCard
          icon={Zap}
          title="Top Spending Category"
          value={topCategory.name}
          sub={`${topCategoryPct}% of expenses`}
          accent={topCat.color}
          delay="0s"
        />
        <InsightCard
          icon={TrendingDown}
          title="Avg Monthly Expenses"
          value={formatCurrency(avgMonthlyExpense, true)}
          sub="6-month average"
          accent="var(--expense)"
          delay="0.07s"
        />
        <InsightCard
          icon={TrendingUp}
          title="Month-over-Month"
          value={`${expChangeNum > 0 ? '+' : ''}${expenseChange}%`}
          sub="Expense change"
          accent={expChangeNum > 5 ? 'var(--expense)' : expChangeNum < -5 ? 'var(--income)' : 'var(--text-secondary)'}
          trend={expTrend}
          delay="0.14s"
        />
        <InsightCard
          icon={Trophy}
          title="Best Savings Month"
          value={bestSavingsMonth.month}
          sub={formatCurrency(bestSavingsMonth.balance) + ' saved'}
          accent="var(--income)"
          delay="0.21s"
        />
      </div>

      {/* Monthly comparison bar chart */}
      <div className="card p-5">
        <div className="mb-5">
          <h2 className="section-title">Monthly Comparison</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Income vs Expenses — Jan through Jun 2024
          </p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} barCategoryGap="30%" barGap={4}>
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
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--border)', radius: 4 }} />
            <Bar dataKey="income" name="income" radius={[5, 5, 0, 0]} maxBarSize={36} fill="var(--income)" opacity={0.85} />
            <Bar dataKey="expenses" name="expenses" radius={[5, 5, 0, 0]} maxBarSize={36} fill="var(--expense)" opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings rate trend */}
      <div className="card p-5">
        <div className="mb-4">
          <h2 className="section-title">Monthly Savings Rate</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            What percentage of income was saved each month
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {monthlyData.map((m) => {
            const rate = m.income > 0 ? ((m.balance / m.income) * 100) : 0;
            const isGood = rate >= 20;
            const isBad = rate < 0;
            const color = isBad ? 'var(--expense)' : isGood ? 'var(--income)' : 'var(--accent)';
            return (
              <div
                key={m.month}
                className="flex flex-col items-center gap-2 p-3 rounded-xl"
                style={{ background: 'var(--bg-elevated)' }}
              >
                <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {m.month}
                </span>
                {/* Circular indicator */}
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={color}
                      strokeWidth="3"
                      strokeDasharray={`${Math.max(0, Math.min(100, rate)) * 0.879} 87.9`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span
                    className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono-custom"
                    style={{ color }}
                  >
                    {Math.round(rate)}%
                  </span>
                </div>
                <span className="text-xs font-mono-custom" style={{ color }}>
                  {isBad ? 'Deficit' : isGood ? 'Great' : 'Fair'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Observations */}
      <div className="card p-5">
        <div className="mb-4">
          <h2 className="section-title">Smart Observations</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Key patterns detected in your financial data
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {observations.map((obs, i) => (
            <ObservationCard
              key={i}
              text={obs.text}
              icon={obs.icon}
              color={obs.color}
              delay={`${i * 0.07}s`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
