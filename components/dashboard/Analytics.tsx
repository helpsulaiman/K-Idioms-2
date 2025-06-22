
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface AnalyticsData {
  totalIdioms: number;
  totalSubmissions: number;
  approvalRate: number;
  monthlyStats: {
    month: string;
    submissions: number;
    approvals: number;
  }[];
  topContributors: {
    name: string;
    count: number;
  }[];
  tagStats: {
    tag: string;
    count: number;
  }[];
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    totalIdioms: 0,
    totalSubmissions: 0,
    approvalRate: 0,
    monthlyStats: [],
    topContributors: [],
    tagStats: []
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Get total idioms
      const { count: totalIdioms } = await supabase
        .from('idioms')
        .select('*', { count: 'exact' });

      // Get total submissions and approved submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('status, created_at');

      const totalSubmissions = submissions?.length || 0;
      const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0;
      const approvalRate = totalSubmissions ? (approvedSubmissions / totalSubmissions) * 100 : 0;

      // Get monthly stats
      const monthlyStats = getMonthlyStats(submissions || []);

      // Get top contributors
      const { data: contributors } = await supabase
        .from('idioms')
        .select('contributor');

      const topContributors = getTopContributors(contributors || []);

      // Get tag statistics
      const { data: idioms } = await supabase
        .from('idioms')
        .select('tags');

      const tagStats = getTagStats(idioms || []);

      setData({
        totalIdioms: totalIdioms || 0,
        totalSubmissions,
        approvalRate,
        monthlyStats,
        topContributors,
        tagStats
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyStats = (submissions: any[]) => {
    const months: { [key: string]: { submissions: number; approvals: number } } = {};
    
    submissions.forEach(submission => {
      const month = new Date(submission.created_at).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!months[month]) {
        months[month] = { submissions: 0, approvals: 0 };
      }
      months[month].submissions++;
      if (submission.status === 'approved') {
        months[month].approvals++;
      }
    });

    return Object.entries(months)
      .map(([month, stats]) => ({
        month,
        ...stats
      }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
      .slice(0, 6) // Last 6 months
      .reverse();
  };

  const getTopContributors = (contributors: any[]) => {
    const counts: { [key: string]: number } = {};
    contributors.forEach(({ contributor }) => {
      if (contributor) {
        counts[contributor] = (counts[contributor] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 contributors
  };

  const getTagStats = (idioms: any[]) => {
    const counts: { [key: string]: number } = {};
    idioms.forEach(({ tags }) => {
      if (tags && Array.isArray(tags)) {
        tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 tags
  };

  if (loading) {
    return <div className="text-center py-4">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold mb-4">Analytics Dashboard</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="font-semibold mb-2">Total Idioms</h3>
          <div className="text-3xl font-bold text-primary">{data.totalIdioms}</div>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold mb-2">Total Submissions</h3>
          <div className="text-3xl font-bold text-blue-600">{data.totalSubmissions}</div>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold mb-2">Approval Rate</h3>
          <div className="text-3xl font-bold text-green-600">
            {data.approvalRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="card">
        <h3 className="font-semibold mb-4">Monthly Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Month</th>
                <th className="text-right py-2">Submissions</th>
                <th className="text-right py-2">Approvals</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyStats.map((month) => (
                <tr key={month.month} className="border-t">
                  <td className="py-2">{month.month}</td>
                  <td className="text-right py-2">{month.submissions}</td>
                  <td className="text-right py-2">{month.approvals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contributors and Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Top Contributors</h3>
          <div className="space-y-2">
            {data.topContributors.map((contributor) => (
              <div key={contributor.name} className="flex justify-between items-center">
                <span>{contributor.name}</span>
                <span className="font-semibold">{contributor.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.tagStats.map((tag) => (
              <div
                key={tag.tag}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {tag.tag} ({tag.count})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;