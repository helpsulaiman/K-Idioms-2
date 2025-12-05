import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import PillNav from './PillNav';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title = 'Kashmiri Idioms - Preserving Cultural Heritage',
    description = 'Discover traditional Kashmiri idioms and their meanings. Explore our collection of cultural expressions that carry the wisdom of Kashmir.'
}) => {
    const router = useRouter();
    const user = useUser();

    const navItems = React.useMemo(() => [
        { label: 'Home', href: '/' },
        { label: 'Hečhun (Learn)', href: '/hechun' },
        { label: 'Submit Idiom', href: '/submit' },
        { label: 'About Project', href: '/about-project' },
        { label: 'About Us', href: '/about' },
        user ? { label: 'Profile', href: '/profile' } : { label: 'Login', href: '/auth/login' }
    ], [user]);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                    integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </Head>

            <div className="min-h-screen flex flex-col">
                <header className="container mx-auto flex pt-4 px-4">
                    <PillNav
                        logo="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritWOTextLight.png"
                        logoDark="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDspiritWOtextDark.png"
                        logoAlt="KashWords Logo"
                        items={navItems}
                        activeHref={router.pathname}
                        baseColor="#1e293b" // Slate-800
                        pillColor="#fdba74" // Light Orange (Orange-300)
                        pillTextColor="#1e293b"
                        hoveredPillTextColor="#ffffff"
                    />
                </header>

                <main className="flex-1 w-full max-w-[1400px] mx-auto">
                    {/* FIX: This line was missing. It renders the actual page content. */}
                    {children}
                </main>

                <footer
                    className="py-8 text-center border-t"
                    style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-light)',
                        color: 'var(--text-secondary)'
                    }}
                >
                    <div className="container">
                        <p className="text-sm">
                            © 2024 KashWords - Preserving the wisdom of Kashmir 🍁
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Layout;