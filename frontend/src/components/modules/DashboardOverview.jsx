import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, AlertTriangle } from 'lucide-react';
import StatCard from '../common/StatCard';
import { fetchDashboardStats } from '../../services/api';
import BookManagement from './BookManagement';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalTitles: 0,
    totalCopies: 0,
    availableCopies: 0,
    totalIssued: 0,
    overdueCount: 0,
    totalMembers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchDashboardStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Stats loading error:', err);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards matching your reference screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <StatCard
          icon={BookOpen}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          value={stats.totalTitles}
          title="Total Book Titles"
          statusPrimary={`${stats.availableCopies} Available`}
          statusSecondary={`${stats.totalCopies} Total Copies`}
          tooltipText="Total unique titles registered in catalog"
        />

        {/* Card 2 */}
        <StatCard
          icon={Clock}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          value={stats.totalIssued}
          title="Active Issued Books"
          statusPrimary={`${stats.totalIssued} On Loan`}
          statusSecondary={`${stats.availableCopies} In Library`}
          tooltipText="Currently borrowed books waiting for return"
        />

        {/* Card 3 */}
        <StatCard
          icon={AlertTriangle}
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          value={stats.overdueCount}
          title="Overdue Books"
          statusPrimary={`${stats.overdueCount} Needs Followup`}
          statusSecondary="Late fine applied"
          tooltipText="Books past due date accumulating late fines"
        />

        {/* Card 4 */}
        <StatCard
          icon={Users}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          value={stats.totalMembers}
          title="Registered Members"
          statusPrimary="Active Members"
          statusSecondary="Eligible to borrow"
          tooltipText="Students and staff registered in the library system"
        />
      </div>

      {/* Live Catalog Preview */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-slate-800">Quick Catalog Overview</h2>
          <p className="text-xs text-slate-400">View and manage book inventory in real-time</p>
        </div>
        <BookManagement />
      </div>
    </div>
  );
};

export default DashboardOverview;