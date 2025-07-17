import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Idiom } from '../../types/idiom';

const DashboardPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useSupabaseClient();

  useEffect(() => {
    // Check for stored authentication
    const isAuth = localStorage.getItem('dashboardAuth') === 'true';
    setIsAuthenticated(isAuth);
    setShowLogin(!isAuth);

    if (isAuth) {
      fetchIdioms();
    }
  }, []);

  const fetchIdioms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('idioms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdioms(data || []);
    } catch (error) {
      console.error('Error fetching idioms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('dashboardAuth', 'true');
      fetchIdioms();
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('dashboardAuth');
  };

  if (showLogin && !isAuthenticated) {
    return (
      <Layout title="Dashboard - Kashmiri Idioms">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-2xl font-bold mb-6 text-center">Dashboard Login</h1>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter dashboard password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading idioms...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">All Idioms ({idioms.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kashmiri
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Translation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {idioms.map((idiom) => (
                      <tr key={idiom.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{idiom.idiom_kashmiri}</div>
                          <div className="text-sm text-gray-500">{idiom.transliteration}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{idiom.translation}</div>
                          <div className="text-sm text-gray-500">{idiom.meaning}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {idiom.created_at ?
                              (() => {
                                try {
                                  return new Date(idiom.created_at!).toLocaleDateString();
                                } catch {
                                  return 'Invalid date';
                                }
                              })()
                              : '-'}
                        </td>
                      </tr>
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;