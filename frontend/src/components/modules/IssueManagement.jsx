import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Search, CheckCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { fetchTransactions, issueBook, returnBook } from '../../services/api';
import Tooltip from '../common/Tooltip';
import Pagination from '../common/Pagination';
import IssueModal from './IssueModal';

const IssueManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Notifications & Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetchTransactions({
        status: statusFilter,
        search,
        page: currentPage,
        limit: 5,
      });
      if (res.data.success) {
        setTransactions(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalRecords(res.data.pagination.totalRecords);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [search, statusFilter, currentPage]);

  const handleIssueSubmit = async (formData) => {
    setErrorMsg('');
    try {
      const res = await issueBook(formData);
      setSuccessMsg(res.data.message || 'Book issued successfully!');
      setIsModalOpen(false);
      loadTransactions();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not issue book');
    }
  };

  const handleReturn = async (id, title) => {
    if (window.confirm(`Confirm return for "${title}"?`)) {
      try {
        const res = await returnBook(id);
        setSuccessMsg(res.data.message || 'Book returned successfully!');
        loadTransactions();
        setTimeout(() => setSuccessMsg(''), 4500);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Return failed');
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Messages */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>✅ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold">✕</button>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-1.5"><AlertCircle size={15} /> {errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="font-bold">✕</button>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search member name or book..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ISSUED">Active Issues</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>

        <Tooltip content="Issue a library book to a registered student or faculty member">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition active:scale-95"
          >
            <ArrowLeftRight size={15} />
            Issue New Book
          </button>
        </Tooltip>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Book Title</th>
                <th className="py-3.5 px-4">Borrower (Member)</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Fine (₹10/day)</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    Loading issue records...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isReturned = tx.status === 'RETURNED';
                  const isOverdue = tx.isOverdue;

                  return (
                    <tr
                      key={tx._id}
                      className={`hover:bg-slate-50/60 transition ${
                        isOverdue ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Book */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{tx.book?.title || 'Unknown'}</p>
                        <p className="text-[11px] text-slate-400 font-mono">ISBN: {tx.book?.isbn}</p>
                      </td>

                      {/* Member */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{tx.member?.name || 'Unknown'}</p>
                        <p className="text-[11px] text-slate-400">{tx.member?.membershipId}</p>
                      </td>

                      {/* Dates */}
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(tx.issueDate).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-medium ${
                            isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'
                          }`}
                        >
                          {new Date(tx.dueDate).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isReturned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            <CheckCircle size={12} className="text-slate-500" />
                            Returned
                          </span>
                        ) : isOverdue ? (
                          <Tooltip content="Book is past due date! Accruing late fines.">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 animate-pulse">
                              <AlertTriangle size={12} />
                              Overdue
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600">
                            <Clock size={12} />
                            Issued
                          </span>
                        )}
                      </td>

                      {/* Late Fine */}
                      <td className="py-3 px-4 text-center">
                        {tx.calculatedFine > 0 ? (
                          <Tooltip content="₹10 charged per day overdue">
                            <span className="px-2 py-0.5 rounded-md font-bold text-xs bg-rose-50 text-rose-600 border border-rose-200">
                              ₹{tx.calculatedFine}
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="text-slate-400">₹0</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {isReturned ? (
                          <span className="text-[11px] text-slate-400">
                            Returned on {new Date(tx.returnDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <Tooltip content="Accept return and restore 1 copy into available stock">
                            <button
                              onClick={() => handleReturn(tx._id, tx.book?.title)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95"
                            >
                              Return Book
                            </button>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
          limit={5}
        />
      </div>

      <IssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleIssueSubmit}
      />
    </div>
  );
};

export default IssueManagement;