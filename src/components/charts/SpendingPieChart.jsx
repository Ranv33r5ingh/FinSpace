import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { useState } from 'react';

const RADIAN = Math.PI / 180;

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  const cat = CATEGORIES[name] || {};
  return (
    <div className="custom-tooltip">
      <div className="flex items-center gap-2 mb-1">
        <span>{cat.icon}</span>
        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{name}</span>
      </div>
      <div className="font-mono-custom font-bold text-base" style={{ color: cat.color || 'var(--accent)' }}>
        {formatCurrency(value)}
      </div>
    </div>
  );
};

export default function SpendingPieChart() {
  const getCategoryBreakdown = useStore((s) => s.getCategoryBreakdown);
  const data = getCategoryBreakdown().slice(0, 8);
  const [activeIdx, setActiveIdx] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  if (!data.length) {
    return (
      <div className="card p-5 flex items-center justify-center" style={{ minHeight: 280 }}>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="card p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="mb-4">
        <h2 className="section-title">Spending Breakdown</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Top categories · All time</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Donut chart */}
        <div className="shrink-0" style={{ width: 180, height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={<CustomLabel />}
                onMouseEnter={(_, idx) => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {data.map((entry, idx) => {
                  const color = CATEGORIES[entry.name]?.color || '#8B5CF6';
                  return (
                    <Cell
                      key={entry.name}
                      fill={color}
                      opacity={activeIdx === null || activeIdx === idx ? 1 : 0.4}
                      style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full grid grid-cols-1 gap-1.5">
          {data.map((item, idx) => {
            const cat = CATEGORIES[item.name] || {};
            const pct = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={item.name}
                className="flex items-center gap-2 text-xs group cursor-default rounded-lg px-2 py-1 transition-all"
                style={{
                  background: activeIdx === idx ? 'var(--bg-elevated)' : 'transparent',
                }}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cat.color }} />
                <span className="flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {cat.icon} {item.name}
                </span>
                <span className="font-mono-custom font-semibold shrink-0" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(item.value, true)}
                </span>
                <span className="text-xs w-10 text-right shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
