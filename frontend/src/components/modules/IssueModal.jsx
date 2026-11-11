import React, { useState, useEffect } from 'react';
import { X, ArrowLeftRight, Calendar } from 'lucide-react';
import { fetchBooks, fetchMembers } from '../../services/api';

const IssueModal = ({ isOpen, onClose, onSubmit }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      // Default due date: 7 days from today
      const defaultDue = new Date();
      defaultDue.setDate(defaultDue.getDate() + 7);
      setDueDate(defaultDue.toISOString().split('T')[0]);
      setError('');
      setSelectedBook('');
      setSelectedMember('');
      setRemarks('');
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [booksRes, membersRes] = await Promise.all([
        fetchBooks({ limit: 100 }),
        fetchMembers(),
      ]);
      if (booksRes.data.success) setBooks(booksRes.data.data);
      if (membersRes.data.success) setMembers(membersRes.data.data);
    } catch (err) {
      setError('Failed to load books or members list');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedMember || !dueDate) {
      setError('Please select a book, a member, and a due date.');
      return;
    }

    const chosenBook = books.find((b) => b._id === selectedBook);
    if (chosenBook && chosenBook.availableQuantity <= 0) {
      setError('This book is currently out of stock and cannot be issued.');
      return;
    }

    onSubmit({
      bookId: selectedBook,
      memberId: selectedMember,
      dueDate,
      remarks,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ArrowLeftRight size={18} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Issue Book to Member</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Book Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Book <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            >
              <option value="">-- Choose Book --</option>
              {books.map((b) => (
                <option
                  key={b._id}
                  value={b._id}
                  disabled={b.availableQuantity === 0}
                >
                  {b.title} ({b.availableQuantity > 0 ? `${b.availableQuantity} available` : 'OUT OF STOCK'})
                </option>
              ))}
            </select>
          </div>

          {/* Member Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Member <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.membershipId} - {m.email})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Remarks (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. First semester issue"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition"
            >
              Confirm & Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueModal;