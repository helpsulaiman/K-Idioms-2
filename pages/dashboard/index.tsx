import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  // Simple password protection - in production, use proper authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Change this to your desired password
      setIsAuthenticated(true);
      setShowLogin(false);
    } else {
      alert('Incorrect password');
    }
  };

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

  return (
    <Layout title="Dashboard - Kashmiri Idioms">
      <div className="container section">
        <div className="dashboard-grid">
          <div className="dashboard-sidebar">
            <h2 className="font-bold mb-4">Dashboard</h2>
            <nav className="space-y-2">
              <a href="#submissions" className="block py-2 px-3 rounded hover:bg-muted">
                Pending Submissions
              </a>
              <a href="#idioms" className="block py-2 px-3 rounded hover:bg-muted">
                All Idioms
              </a>
              <a href="#analytics" className="block py-2 px-3 rounded hover:bg-muted">
                Analytics
              </a>
            </nav>
          </div>
          
          <div className="dashboard-content">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <h3 className="font-semibold mb-2">Total Idioms</h3>
                <div className="text-3xl font-bold text-primary">--</div>
              </div>
              <div className="card text-center">
                <h3 className="font-semibold mb-2">Pending Submissions</h3>
                <div className="text-3xl font-bold text-yellow-600">--</div>
              </div>
              <div className="card text-center">
                <h3 className="font-semibold mb-2">This Month</h3>
                <div className="text-3xl font-bold text-green-600">--</div>
              </div>
            </div>
            
            <div className="card">
              <h2 className="card-title">Recent Activity</h2>
              <p className="text-secondary">Dashboard functionality coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;