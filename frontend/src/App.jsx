import React, { useState, useEffect } from 'react';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import LoginPage from './components/common/LoginPage';
import DashboardOverview from './components/modules/DashboardOverview';
import BookManagement from './components/modules/BookManagement';
import IssueManagement from './components/modules/IssueManagement';
import MemberManagement from './components/modules/MemberManagement';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // Check if token exists on load
  useEffect(() => {
    const savedUser = localStorage.getItem('library_user');
    const token = localStorage.getItem('library_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('library_token');
    localStorage.removeItem('library_user');
    setUser(null);
  };

  const todayString = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // If not logged in, render Login Page
  if (!user) {
    return <LoginPage onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left Sidebar containing the Two Modules */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          searchTerm={globalSearch}
          setSearchTerm={setGlobalSearch}
          onLogout={handleLogout}
        />

        <main className="p-8 space-y-6 flex-1 overflow-y-auto">
          {/* Header Title Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {activeTab === 'dashboard' && 'Library Overview'}
                {activeTab === 'books' && 'Book Management'}
                {activeTab === 'issues' && 'Book Issue & Return Management'}
                {activeTab === 'members' && 'Member Management'}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span>{todayString}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-emerald-600">Live</span>
              </p>
            </div>
          </div>

          {/* Render Active View */}
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'books' && <BookManagement globalSearch={globalSearch} />}
          {activeTab === 'issues' && <IssueManagement />}
          {activeTab === 'members' && <MemberManagement />}
        </main>
      </div>
    </div>
  );
}

export default App;