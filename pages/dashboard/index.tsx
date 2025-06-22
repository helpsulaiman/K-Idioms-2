import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import PendingSubmissions from '../../components/dashboard/PendingSubmissions';
import AllIdioms from '../../components/dashboard/AllIdioms';
import Analytics from '../../components/dashboard/Analytics';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

type DashboardTab = 'submissions' | 'idioms' | 'analytics';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('submissions');
  const [stats, setStats] = useState({
    totalIdioms: 0,
    pendingSubmissions: 0,
    thisMonth: 0
  });

  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch total idioms
      const { count: totalIdioms } = await supabase
          .from('idioms')
          .select('*', { count: 'exact' });

      // Fetch pending submissions
      const { count: pendingCount } = await supabase
          .from('submissions')
          .select('*', { count: 'exact' })
          .eq('status', 'pending');

      // Fetch this month's submissions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount } = await supabase
          .from('submissions')
          .select('*', { count: 'exact' })
          .gte('created_at', startOfMonth.toISOString());

      setStats({
        totalIdioms: totalIdioms || 0,
        pendingSubmissions: pendingCount || 0,
        thisMonth: monthlyCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cxerkhayi1baar') {
      setIsAuthenticated(true);
      setShowLogin(false);
      // Store authentication state in localStorage
      localStorage.setItem('dashboardAuth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    // Check for stored authentication
    const isAuth = localStorage.getItem('dashboardAuth') === 'true';
    setIsAuthenticated(isAuth);
    setShowLogin(!isAuth);
  }, []);

  if (showLogin && !isAuthenticated) {
    return (
        <Layout title="Dashboard - Kashmiri Idioms">
          <div className="container section">
            <div className="max-w-md mx-auto">
              <div className="card">
                <h1 className="text-2xl font-bold mb-6 text-center">Dashboard Login</h1>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        placeholder="Enter dashboard password"
                        required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Layout>
    );
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('dashboardAuth');
  };

  return (
      <Layout title="Dashboard - Kashmiri Idioms">
        <div className="container section">
          <div className="dashboard-grid">
            <div className="dashboard-sidebar">
              <h2 className="font-bold mb-4">Dashboard</h2>
              <nav className="space-y-2">
                <button
                    onClick={() => setActiveTab('submissions')}
                    className={`block w-full text-left py-2 px-3 rounded ${
                        activeTab === 'submissions' ? 'bg-primary text-white' : 'hover:bg-muted'
                    }`}
                >
                  Pending Submissions
                </button>
                <button
                    onClick={() => setActiveTab('idioms')}
                    className={`block w-full text-left py-2 px-3 rounded ${
                        activeTab === 'idioms' ? 'bg-primary text-white' : 'hover:bg-muted'
                    }`}
                >
                  All Idioms
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`block w-full text-left py-2 px-3 rounded ${
                        activeTab === 'analytics' ? 'bg-primary text-white' : 'hover:bg-muted'
                    }`}
                >
                  Analytics
                </button>
                <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </nav>
            </div>

            <div className="dashboard-content">
              <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card text-center">
                  <h3 className="font-semibold mb-2">Total Idioms</h3>
                  <div className="text-3xl font-bold text-primary">{stats.totalIdioms}</div>
                </div>
                <div className="card text-center">
                  <h3 className="font-semibold mb-2">Pending Submissions</h3>
                  <div className="text-3xl font-bold text-yellow-600">{stats.pendingSubmissions}</div>
                </div>
                <div className="card text-center">
                  <h3 className="font-semibold mb-2">This Month</h3>
                  <div className="text-3xl font-bold text-green-600">{stats.thisMonth}</div>
                </div>
              </div>

              <div className="card">
                {activeTab === 'submissions' && <PendingSubmissions onUpdate={fetchDashboardStats} />}
                {activeTab === 'idioms' && <AllIdioms onUpdate={fetchDashboardStats} />}
                {activeTab === 'analytics' && <Analytics />}
              </div>
            </div>
          </div>
        </div>
      </Layout>
  );
};

export default DashboardPage;