import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Tooltip from './Tooltip';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange, limit = 5 }) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-100 rounded-b-xl">
      <div className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <Tooltip content="Previous Page">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`p-2 rounded-lg border border-slate-200 text-slate-600 transition ${
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed bg-slate-50'
                : 'hover:bg-slate-100 active:scale-95'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
        </Tooltip>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition ${
              currentPage === pageNum
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <Tooltip content="Next Page">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`p-2 rounded-lg border border-slate-200 text-slate-600 transition ${
              currentPage >= totalPages
                ? 'opacity-40 cursor-not-allowed bg-slate-50'
                : 'hover:bg-slate-100 active:scale-95'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Pagination;