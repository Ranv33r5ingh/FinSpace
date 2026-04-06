import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import { clsx } from 'clsx';

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  insights: Insights,
};

export default function App() {
  const { activePage, darkMode } = useStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply dark mode class on mount and change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Responsive: auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const PageComponent = PAGES[activePage] || Dashboard;
  const sidebarWidth = sidebarCollapsed ? 64 : 224;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
      />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 p-5 md:p-6">
          <PageComponent key={activePage} />
        </main>

        {/* Footer */}
        <footer
          className="px-6 py-3 text-center text-xs border-t"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
        >
          FinSpace eVa 1.0+0.0
        </footer>
      </div>
    </div>
  );
}
