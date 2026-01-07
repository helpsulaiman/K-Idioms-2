import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import BubbleMenu from './BubbleMenu';
import Footer from './Footer';
import FeedbackButton from './ui/FeedbackButton';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
    children,
    title = 'Kashmiri Idioms - Preserving Cultural Heritage',
    description = 'Discover traditional Kashmiri idioms and their meanings. Explore our collection of cultural expressions that carry the wisdom of Kashmir.',
    fullWidth = false
}) => {
    const router = useRouter();
    const user = useUser();
    const supabase = useSupabaseClient();
    const [isAdmin, setIsAdmin] = useState(false);

    // Check admin status when user changes
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                setIsAdmin(false);
                return;
            }
            const { data } = await supabase
                .from('user_stats')
                .select('is_admin')
                .eq('user_id', user.id)
                .maybeSingle();

            setIsAdmin(data?.is_admin === true);
        };
        checkAdminStatus();
    }, [user, supabase]);

    const navItems = React.useMemo(() => {
        const items = [
            {
                label: 'Kashmiri Idioms',
                href: '/',
                rotation: -8,
                hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } // Green
            },
            {
                label: 'Submit Idiom',
                href: '/submit',
                rotation: 8,
                hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } // Blue
            },
            {
                label: 'About Project',
                href: '/about-project',
                rotation: 8,
                hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } // Purple
            },
            {
                label: 'About Us',
                href: '/about-us',
                rotation: -8,
                hoverStyles: { bgColor: '#06b6d4', textColor: '#ffffff' } // Cyan 
            },
        ];

        // Add Dashboard link for admins
        if (isAdmin) {
            items.push({
                label: 'Dashboard',
                href: '/dashboard',
                rotation: 8,
                hoverStyles: { bgColor: '#dc2626', textColor: '#ffffff' } // Red
            });
        }

        return items;
    }, [isAdmin]);

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </Head>

            <div className="min-h-screen flex flex-col">
                <header className="container mx-auto flex pt-4 px-4 z-50 relative">
                    <BubbleMenu
                        logo={null}
                        items={navItems}
                        menuAriaLabel="Toggle navigation"
                        menuBg="#ffffff"
                        menuContentColor="#111111"
                        useFixedPosition={true}
                        animationEase="back.out(1.5)"
                        animationDuration={0.5}
                        staggerDelay={0.12}
                    />
                </header>

                <main className={`flex-1 w-full ${fullWidth ? '' : 'max-w-[1400px] mx-auto pt-16 sm:pt-20 pb-16'}`}>
                    {children}
                </main>

                <Footer />
                {!router.pathname.startsWith('/dashboard') && <FeedbackButton />}
            </div>
        </>
    );
};

export default Layout;