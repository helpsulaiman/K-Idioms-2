// pages/dashboard/index.tsx
import React from 'react';
import Layout from '../../components/Layout';
import DashboardLayout from '../../components/DashboardLayout';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSidePropsContext } from 'next';

interface DashboardProps {
    idiomsCount: number;
    suggestionsCount: number;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const { data: idioms } = await supabase.from('idioms').select('id', { count: 'exact' });
    const { data: suggestions } = await supabase.from('suggestions').select('id', { count: 'exact' });

    return {
        props: {
            idiomsCount: idioms?.length || 0,
            suggestionsCount: suggestions?.length || 0,
        },
    };
};

const DashboardOverviewPage: React.FC<DashboardProps> = ({ idiomsCount, suggestionsCount }) => {
    return (
        <Layout title="Dashboard">
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6">Overview</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white rounded-lg border">
                        <h2 className="text-lg font-semibold text-gray-500">Approved Idioms</h2>
                        <p className="text-4xl font-bold mt-2">{idiomsCount}</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg border">
                        <h2 className="text-lg font-semibold text-gray-500">Pending Suggestions</h2>
                        <p className="text-4xl font-bold mt-2">{suggestionsCount}</p>
                    </div>
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default DashboardOverviewPage;