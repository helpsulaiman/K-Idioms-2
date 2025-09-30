import React from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

const DashboardCard = ({ href, title, description }: { href: string; title: string; description: string }) => (
    <Link href={href} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">{description}</p>
    </Link>
);

const DashboardPage: React.FC = () => {
  // NOTE: This page no longer needs login logic,
  // as the middleware should protect the entire /dashboard route.

  return (
      <Layout title="Dashboard">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard
                href="/dashboard/idioms"
                title="Manage Idioms"
                description="Edit, delete, and add to the main list of approved idioms."
            />
            <DashboardCard
                href="/dashboard/suggestions"
                title="Manage Suggestions"
                description="Approve or delete new idioms submitted by the community."
            />
            <DashboardCard
                href="/dashboard/alphabet"
                title="Manage Alphabet"
                description="Add or edit the letters and examples for the alphabet lesson."
            />
            <DashboardCard
                href="/dashboard/lessons"
                title="Manage Lessons"
                description="Create and edit sentence-based exercises (MCQ, translation)."
            />
          </div>
        </div>
      </Layout>
  );
};

export default DashboardPage;