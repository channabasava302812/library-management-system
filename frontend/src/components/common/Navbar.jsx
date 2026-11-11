import React from 'react';
import { Search, LogOut } from 'lucide-react';
import Tooltip from './Tooltip';

const Navbar = ({ searchTerm, setSearchTerm, placeholder = "Search books, members, ISBN...", onLogout }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Top Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <Tooltip content="End Session">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition cursor-pointer active:scale-95"
          >
            <LogOut size={14} />
            Logout
          </button>
        </Tooltip>

        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ml-1">
          AL
        </div>
      </div>
    </header>
  );
};

export default Navbar;