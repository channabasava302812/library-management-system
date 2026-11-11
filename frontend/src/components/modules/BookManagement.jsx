import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { fetchBooks, createBook, updateBook, deleteBook } from '../../services/api';
import Tooltip from '../common/Tooltip';
import Pagination from '../common/Pagination';
import BookModal from './BookModal';

const CATEGORIES = ['All', 'Technology', 'Fiction', 'Science', 'History', 'Philosophy', 'Business', 'Other'];

const BookManagement = ({ globalSearch = '' }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [availability, setAvailability] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Sync with navbar search if provided
  useEffect(() => {
    if (globalSearch !== '') {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await fetchBooks({
        search,
        category,
        availability,
        page: currentPage,
        limit: 5,
      });
      if (res.data.success) {
        setBooks(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setTotalBooks(res.data.pagination.totalBooks);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [search, category, availability, currentPage]);

  const handleCreateOrUpdate = async (formData) => {
    setErrorMsg('');
    try {
      if (selectedBook) {
        await updateBook(selectedBook._id, formData);
        setSuccessMsg('Book updated successfully!');
      } else {
        await createBook(formData);
        setSuccessMsg('Book registered successfully!');
      }
      setIsModalOpen(false);
      setSelectedBook(null);
      loadBooks();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (bookId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBook(bookId);
        setSuccessMsg('Book deleted successfully!');
        loadBooks();
        setTimeout(() => setSuccessMsg(''), 3500);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to delete book');
        setTimeout(() => setErrorMsg(''), 4500);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Notifications */}
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

      {/* Action Header Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Local Search Input */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Filter size={14} className="text-slate-400" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-700 font-medium focus:outline-none text-xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <select
            value={availability}
            onChange={(e) => {
              setAvailability(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Availability</option>
            <option value="available">Available in Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Register Book Button */}
        <Tooltip content="Register a new book into library catalog">
          <button
            onClick={() => {
              setSelectedBook(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition active:scale-95"
          >
            <Plus size={15} />
            Register Book
          </button>
        </Tooltip>
      </div>

      {/* Books Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Book Info</th>
                <th className="py-3.5 px-4">ISBN</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Available / Total</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    Loading books...
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No books found matching criteria.
                  </td>
                </tr>
              ) : (
                books.map((book) => {
                  const isAvailable = book.availableQuantity > 0;
                  return (
                    <tr key={book._id} className="hover:bg-slate-50/60 transition">
                      {/* Book Title & Author */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">{book.title}</p>
                            <p className="text-[11px] text-slate-400">{book.author}</p>
                          </div>
                        </div>
                      </td>

                      {/* ISBN */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {book.isbn}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                          {book.category}
                        </span>
                      </td>

                      {/* Available vs Total Quantity */}
                      <td className="py-3 px-4 text-center">
                        <Tooltip content={`${book.availableQuantity} of ${book.totalQuantity} copies ready to issue`}>
                          <span className="font-bold text-slate-800 text-xs cursor-default">
                            {book.availableQuantity}{' '}
                            <span className="text-slate-400 font-normal">/ {book.totalQuantity}</span>
                          </span>
                        </Tooltip>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-center">
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Out of Stock
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip content="Edit book details">
                            <button
                              onClick={() => {
                                setSelectedBook(book);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            >
                              <Pencil size={15} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Delete book record">
                            <button
                              onClick={() => handleDelete(book._id, book.title)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalBooks}
          onPageChange={(page) => setCurrentPage(page)}
          limit={5}
        />
      </div>

      {/* Registration & Edit Modal */}
      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedBook}
      />
    </div>
  );
};

export default BookManagement;