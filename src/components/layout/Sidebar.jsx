import { useStore } from '../../store/useStore';
import {
  LayoutDashboard, Receipt, Lightbulb, Sun, Moon,
  ChevronRight, TrendingUp, Shield, Eye,
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { activePage, setActivePage, darkMode, toggleDarkMode, role } = useStore();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen z-30 flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-56',
      )}
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div
        className={clsx(
          'flex items-center h-16 px-4 border-b shrink-0',
          collapsed ? 'justify-center' : 'gap-3',
        )}
        style={{ borderColor: 'var(--border)' }}
      >
        <img
          src="../../../public/favicon.png"
          alt="FinSpace"
          className="w-7 h-7 object-contain rounded-md"
        />
        {!collapsed && (
          <span className="font-display font-800 text-base tracking-tight" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>
            FinSpace
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={clsx('nav-item w-full text-left', { active: activePage === id, 'justify-center px-0': collapsed })}
          >
            <Icon size={17} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
        {/* Role badge */}
        {!collapsed && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'var(--bg-elevated)' }}
          >
            {role === 'admin' ? (
              <Shield size={13} style={{ color: 'var(--accent)' }} />
            ) : (
              <Eye size={13} style={{ color: 'var(--text-muted)' }} />
            )}
            <span className="text-xs font-semibold" style={{ color: role === 'admin' ? 'var(--accent)' : 'var(--text-muted)' }}>
              {role === 'admin' ? 'Admin' : 'Viewer'}
            </span>
          </div>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={clsx('nav-item w-full text-left', { 'justify-center px-0': collapsed })}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={clsx('nav-item w-full text-left', { 'justify-center px-0': collapsed })}
        >
          <ChevronRight
            size={16}
            className="transition-transform duration-300"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
