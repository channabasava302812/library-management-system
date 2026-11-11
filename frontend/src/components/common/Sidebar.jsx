import React from 'react';
import {
  BookOpen,
  ArrowLeftRight,
  LayoutDashboard,
  ChevronsLeft,
  Users,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import Tooltip from './Tooltip';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-6 px-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-300">
              LB
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">LIB MS</h2>
              <p className="text-[11px] text-slate-400">Library Management</p>
            </div>
          </div>
          <Tooltip content="Collapse sidebar">
            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
              <ChevronsLeft size={18} />
            </button>
          </Tooltip>
        </div>

        {/* OVERVIEW Section */}
        <div className="mt-6">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Overview
          </span>
          <nav className="mt-2 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
          </nav>
        </div>

        {/* MODULES Section (The 2 Core Task Modules in Left Corner) */}
        <div className="mt-6">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Modules
          </span>
          <nav className="mt-2 space-y-1">
            {/* Module 1 */}
            <Tooltip content="Register, edit, view & delete books" position="right">
              <button
                onClick={() => setActiveTab('books')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'books'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <BookOpen size={18} />
                Book Management
              </button>
            </Tooltip>

            {/* Module 2 */}
            <Tooltip content="Issue books, handle returns, fines & overdues" position="right">
              <button
                onClick={() => setActiveTab('issues')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'issues'
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <ArrowLeftRight size={18} />
                Issue & Return
              </button>
            </Tooltip>
          </nav>
        </div>

        {/* SYSTEM / MANAGEMENT Section */}
        <div className="mt-6">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Management
          </span>
          <nav className="mt-2 space-y-1">
            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === 'members'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Users size={18} />
              Members
            </button>
          </nav>
        </div>
      </div>

      {/* User Profile Pill at Bottom Left (matching reference UI) */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            AL
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">admin last</p>
            <span className="text-[10px] text-slate-400">Admin</span>
          </div>
        </div>
        <ShieldCheck size={16} className="text-emerald-500" />
      </div>
    </aside>
  );
};

export default Sidebar;