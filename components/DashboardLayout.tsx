// components/DashboardLayout.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const navLinks = [
        { href: '/dashboard', label: 'Overview' },
        { href: '/dashboard/idioms', label: 'Manage Idioms' },
        { href: '/dashboard/suggestions', label: 'Manage Suggestions' },
        { href: '/dashboard/alphabet', label: 'Manage Alphabet' },
        { href: '/dashboard/lessons', label: 'Manage Lessons' },
    ];

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <nav>
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={router.pathname === link.href ? 'active' : ''}>
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;