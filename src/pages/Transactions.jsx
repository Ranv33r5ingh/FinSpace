import { useState } from 'react';
import { useStore } from '../store/useStore';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionTable from '../components/transactions/TransactionTable';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import { Plus, Lock } from 'lucide-react';

export default function Transactions() {
  const { role } = useStore();
  const [showModal, setShowModal] = useState(false);
  const isAdmin = role === 'admin';

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div />
        {isAdmin ? (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={15} />
            Add Transaction
          </button>
        ) : (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <Lock size={12} />
            View-only mode · Switch to Admin to edit
          </div>
        )}
      </div>

      {/* Filters */}
      <TransactionFilters />

      {/* Table */}
      <TransactionTable />

      {/* Add modal */}
      <AddTransactionModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
