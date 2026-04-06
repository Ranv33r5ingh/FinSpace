import { useStore } from '../../store/useStore';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import {
  Shield, Eye, Download, ChevronDown, Bell, RefreshCw,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

const PAGE_SUBTITLES = {
  dashboard: 'Your financial overview at a glance',
  transactions: 'Browse and manage all transactions',
  insights: 'Patterns and trends in your spending',
};

export default function Header() {
  const { activePage, role, setRole, transactions, resetToMockData } = useStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const exportRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
      if (roleRef.current && !roleRef.current.contains(e.target)) setRoleOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="page-title text-xl leading-tight">{PAGE_TITLES[activePage]}</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {PAGE_SUBTITLES[activePage]}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Reset data */}
        <button
          onClick={resetToMockData}
          className="btn-ghost flex items-center gap-1.5 text-xs"
          title="Reset to demo data"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline">Reset Data</span>
        </button>

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen((p) => !p)}
            className="btn-ghost flex items-center gap-1.5"
          >
            <Download size={14} />
            <span className="hidden sm:inline text-xs">Export</span>
            <ChevronDown size={12} className={clsx('transition-transform', exportOpen && 'rotate-180')} />
          </button>
          {exportOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden animate-slide-up z-50"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
              }}
            >
              <button
                onClick={() => { exportToCSV(transactions); setExportOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:opacity-80 transition-opacity flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--accent)' }}>CSV</span> Export to CSV
              </button>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <button
                onClick={() => { exportToJSON(transactions); setExportOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:opacity-80 transition-opacity flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--neon-purple)' }}>JSON</span> Export to JSON
              </button>
            </div>
          )}
        </div>

        {/* Role switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleOpen((p) => !p)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
            )}
            style={{
              background: role === 'admin' ? 'var(--accent-dim)' : 'var(--bg-elevated)',
              color: role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)',
              borderColor: role === 'admin' ? 'var(--accent-muted)' : 'var(--border)',
            }}
          >
            {role === 'admin' ? <Shield size={12} /> : <Eye size={12} />}
            {role === 'admin' ? 'Admin' : 'Viewer'}
            <ChevronDown size={11} className={clsx('transition-transform', roleOpen && 'rotate-180')} />
          </button>
          {roleOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden animate-slide-up z-50"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
              }}
            >
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Switch Role
              </div>
              {['admin', 'viewer'].map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setRoleOpen(false); }}
                  className={clsx(
                    'w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-all',
                    role === r && 'font-semibold',
                  )}
                  style={{
                    color: role === r ? 'var(--accent)' : 'var(--text-primary)',
                    background: role === r ? 'var(--accent-dim)' : 'transparent',
                  }}
                >
                  {r === 'admin' ? <Shield size={13} /> : <Eye size={13} />}
                  <div>
                    <div className="font-semibold capitalize">{r}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {r === 'admin' ? 'Full access' : 'View only'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
