import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react'; // Import Supabase hook

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const supabase = useSupabaseClient(); // Get the Supabase client

    const navLinks = [
        { href: '/dashboard', label: 'Overview' },
        { href: '/dashboard/idioms', label: 'Manage Idioms' },
        { href: '/dashboard/suggestions', label: 'Manage Suggestions' },
        { href: '/dashboard/alphabet', label: 'Manage Alphabet' },
        { href: '/dashboard/lessons', label: 'Manage Lessons' },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/'); // Redirect to homepage after logout
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar flex flex-col justify-between">
                <nav>
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={router.pathname === link.href ? 'active' : ''}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div>
                    <button onClick={handleLogout} className="btn-secondary">
                        Log Out
                    </button>
                </div>
            </aside>
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;