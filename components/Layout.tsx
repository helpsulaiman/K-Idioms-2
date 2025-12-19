import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import BubbleMenu from './BubbleMenu';
import Footer from './Footer';

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
        {
            label: 'Home',
            href: '/',
            rotation: -8,
            hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } // Blue
        },
        {
            label: 'Hečhun (Learn)',
            href: '/hechun',
            rotation: 8,
            hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } // Green
        },
        {
            label: 'Submit Idiom',
            href: '/submit',
            rotation: -8,
            hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } // Orange
        },
        {
            label: 'About Project',
            href: '/about-project',
            rotation: 8,
            hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } // Purple
        },
        {
            label: 'About Us',
            href: '/about',
            rotation: -8,
            hoverStyles: { bgColor: '#06b6d4', textColor: '#ffffff' } // Cyan 
        },
        user ? {
            label: 'Profile',
            href: '/profile',
            rotation: 8,
            hoverStyles: { bgColor: '#ec4899', textColor: '#ffffff' } // Pink 
        } : {
            label: 'Login',
            href: '/auth/login',
            rotation: 8,
            hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' } // Red
        }
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
                <header className="container mx-auto flex pt-4 px-4 z-50 relative">
                    <BubbleMenu
                        logo={
                            <div className="h-full flex items-center">
                                {/* Light Mode Logo */}
                                <img
                                    src="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/Hechun_L.png"
                                    alt="Hechun Logo"
                                    className="h-full w-auto object-contain dark:hidden block"
                                />
                                {/* Dark Mode Logo */}
                                <img
                                    src="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/Hechun_D.png"
                                    alt="Hechun Logo"
                                    className="h-full w-auto object-contain hidden dark:block"
                                />
                            </div>
                        }
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

                <main className="flex-1 w-full max-w-[1400px] mx-auto pt-16 sm:pt-20 pb-16">
                    {/* FIX: This line was missing. It renders the actual page content. */}
                    {children}
                </main>

                <Footer />
            </div>
        </>
    );
};

export default Layout;