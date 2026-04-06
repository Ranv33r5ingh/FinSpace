import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import AddTransactionModal from './AddTransactionModal';
import { Pencil, Trash2, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--bg-elevated)' }}
      >
        <AlertCircle size={22} style={{ color: 'var(--text-muted)' }} />
      </div>
      <div className="text-center">
        <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {hasFilters ? 'No matching transactions' : 'No transactions yet'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {hasFilters ? 'Try adjusting your filters' : 'Add your first transaction to get started'}
        </p>
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-slide-up"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--expense-bg)' }}>
            <Trash2 size={18} style={{ color: 'var(--expense)' }} />
          </div>
          <h3 className="section-title text-base">Delete Transaction?</h3>
        </div>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          This action cannot be undone. The transaction will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: 'var(--expense)', color: 'white' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionTable() {
  const { role, deleteTransaction, filters } = useStore();
  const getFiltered = useStore((s) => s.getFilteredTransactions);
  const transactions = getFiltered();

  const [editTx, setEditTx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = role === 'admin';
  const hasFilters = filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.month !== 'all';

  const handleDelete = (id) => setDeletingId(id);
  const confirmDelete = () => { deleteTransaction(deletingId); setDeletingId(null); };

  const handleEdit = (tx) => { setEditTx(tx); setShowModal(true); };

  if (!transactions.length) {
    return (
      <>
        <div className="card">
          <EmptyState hasFilters={hasFilters} />
        </div>
        <AddTransactionModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditTx(null); }}
          editTx={editTx}
        />
      </>
    );
  }

  return (
    <>
      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 sm:hidden">
        {transactions.map((tx) => {
          const cat = CATEGORIES[tx.category] || { icon: '💰', color: '#8B5CF6' };
          return (
            <div key={tx.id} className="card p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: `${cat.color}18` }}
              >
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {tx.description}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(tx.date, 'short')} · {tx.category}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div
                  className={clsx('font-mono-custom font-bold text-sm', tx.type === 'income' ? 'amount-positive' : 'amount-negative')}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
                {isAdmin && (
                  <div className="flex justify-end gap-1 mt-1">
                    <button onClick={() => handleEdit(tx)} className="p-1 rounded hover:opacity-70" style={{ color: 'var(--accent)' }}>
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(tx.id)} className="p-1 rounded hover:opacity-70" style={{ color: 'var(--expense)' }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="card hidden sm:block">
        <div className="table-scroll">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Date', 'Description', 'Category', 'Type', 'Amount', ...(isAdmin ? ['Actions'] : [])].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => {
                const cat = CATEGORIES[tx.category] || { icon: '💰', color: '#8B5CF6' };
                return (
                  <tr
                    key={tx.id}
                    className="group transition-colors duration-150"
                    style={{
                      borderBottom: i < transactions.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-mono-custom" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(tx.date, 'short')}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                          style={{ background: `${cat.color}18` }}
                        >
                          {cat.icon}
                        </span>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)', maxWidth: 220 }}>
                            {tx.description}
                          </p>
                          {tx.note && (
                            <p className="text-xs truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
                              {tx.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className="tag"
                        style={{
                          background: `${cat.color}18`,
                          color: cat.color,
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className="badge"
                        style={{
                          background: tx.type === 'income' ? 'var(--income-bg)' : 'var(--expense-bg)',
                          color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)',
                        }}
                      >
                        {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={clsx(
                          'font-mono-custom font-semibold text-sm',
                          tx.type === 'income' ? 'amount-positive' : 'amount-negative',
                        )}
                      >
                        {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Actions - admin only */}
                    {isAdmin && (
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{ background: 'var(--expense-bg)', color: 'var(--expense)' }}
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="px-5 py-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Showing <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{transactions.length}</span> transactions
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Total:{' '}
            <span
              className="font-mono-custom font-semibold"
              style={{
                color: transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0) >= 0
                  ? 'var(--income)' : 'var(--expense)',
              }}
            >
              {formatCurrency(transactions.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0))}
            </span>
          </p>
        </div>
      </div>

      {/* Modals */}
      {deletingId && (
        <DeleteConfirm onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />
      )}
      <AddTransactionModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditTx(null); }}
        editTx={editTx}
      />
    </>
  );
}
