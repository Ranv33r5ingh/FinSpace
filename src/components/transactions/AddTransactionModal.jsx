import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/mockData';
import { X, Plus } from 'lucide-react';

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  category: 'Food & Dining',
  type: 'expense',
  note: '',
};

export default function AddTransactionModal({ open, onClose, editTx = null }) {
  const { addTransaction, updateTransaction } = useStore();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTx) {
      setForm({
        date: editTx.date,
        description: editTx.description,
        amount: editTx.amount.toString(),
        category: editTx.category,
        type: editTx.type,
        note: editTx.note || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editTx, open]);

  if (!open) return null;

  const set = (key, val) => {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === 'type') {
        if (val === 'income' && EXPENSE_CATEGORIES.includes(next.category)) {
          next.category = 'Salary';
        }
        if (val === 'expense' && INCOME_CATEGORIES.includes(next.category)) {
          next.category = 'Food & Dining';
        }
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editTx) {
      updateTransaction(editTx.id, form);
    } else {
      addTransaction(form);
    }
    onClose();
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Centering wrapper ── */}
      <div className="flex min-h-full items-start justify-center p-4 pt-10 sm:pt-14">

        {/* ── Modal card ── */}
        <div
          className="w-full"
          style={{
            maxWidth: '420px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-modal)',
            animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
            isolation: 'isolate',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-4">
            <h2 className="section-title">
              {editTx ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onClose}
              className="btn-ghost"
              style={{ padding: '6px', borderRadius: '50%' }}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          <div className="divider mx-5" />

          {/* Form body */}
          <div className="p-5 flex flex-col gap-4">

            {/* ── Type toggle ── */}
            <div>
              <span className="label-base">Type</span>
              <div className="flex gap-2 mt-1">
                {['expense', 'income'].map((t) => {
                  const isActive = form.type === t;
                  const activeStyles = isActive
                    ? t === 'income'
                      ? {
                          background: 'var(--income-bg)',
                          color: 'var(--income)',
                          borderColor: 'var(--income)',
                          fontWeight: '700',
                          boxShadow: '0 0 10px var(--income-bg)',
                        }
                      : {
                          background: 'var(--expense-bg)',
                          color: 'var(--expense)',
                          borderColor: 'var(--expense)',
                          fontWeight: '700',
                          boxShadow: '0 0 10px var(--expense-bg)',
                        }
                    : {
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        borderColor: 'var(--border)',
                        fontWeight: '500',
                      };

                  return (
                    <button
                      key={t}
                      onClick={() => set('type', t)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        border: '1.5px solid',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                        textTransform: 'capitalize',
                        letterSpacing: '0.02em',
                        ...activeStyles,
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label-base" htmlFor="modal-desc">Description</label>
              <input
                id="modal-desc"
                className="input-base"
                placeholder="e.g. Grocery run, Netflix…"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
              {errors.description && (
                <p className="text-xs mt-1" style={{ color: 'var(--expense)' }}>
                  {errors.description}
                </p>
              )}
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-base" htmlFor="modal-amount">Amount</label>
                <input
                  id="modal-amount"
                  className="input-base"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                />
                {errors.amount && (
                  <p className="text-xs mt-1" style={{ color: 'var(--expense)' }}>
                    {errors.amount}
                  </p>
                )}
              </div>
              <div>
                <label className="label-base" htmlFor="modal-date">Date</label>
                <input
                  id="modal-date"
                  className="input-base"
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                />
                {errors.date && (
                  <p className="text-xs mt-1" style={{ color: 'var(--expense)' }}>
                    {errors.date}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label-base" htmlFor="modal-cat">Category</label>
              <select
                id="modal-cat"
                className="select-base"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="label-base" htmlFor="modal-note">
                Note{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  (optional)
                </span>
              </label>
              <textarea
                id="modal-note"
                className="input-base resize-none"
                rows={2}
                placeholder="Any additional details…"
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="divider mx-5" />
          <div className="flex items-center justify-end gap-3 p-5 pt-4">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit}>
              <Plus size={14} />
              {editTx ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
