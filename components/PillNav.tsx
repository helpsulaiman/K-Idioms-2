import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import styles from '../styles/PillNav.module.css';
import themeStyles from '../styles/ThemeImage.module.css';

interface NavItem {
    label: string;
    href: string;
    ariaLabel?: string;
}

interface PillNavProps {
    logo: string;
    logoDark?: string; // Add optional dark mode logo
    logoAlt?: string;
    items: NavItem[];
    activeHref?: string;
    className?: string;
    ease?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor?: string;
    onMobileMenuClick?: () => void;
    initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
    logo,
    logoDark,
    logoAlt = 'Logo',
    items,
    activeHref,
    className = '',
    ease = 'power3.easeOut',
    baseColor = '#fff',
    pillColor = '#060010',
    hoveredPillTextColor = '#060010',
    pillTextColor,
    onMobileMenuClick,
    initialLoadAnimation = true
}) => {
    const resolvedPillTextColor = pillTextColor ?? baseColor;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
    const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
    const logoImgRef = useRef<HTMLSpanElement>(null);
    const logoTweenRef = useRef<gsap.core.Tween | null>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const navItemsRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLAnchorElement | null>(null);

    // Layout effect - runs when items change or resize
    useEffect(() => {
        const layout = () => {
            circleRefs.current.forEach((circle, index) => {
                if (!circle?.parentElement) return;

                const pill = circle.parentElement;
                const rect = pill.getBoundingClientRect();
                const { width: w, height: h } = rect;
                const R = ((w * w) / 4 + h * h) / (2 * h);
                const D = Math.ceil(2 * R) + 2;
                const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
                const originY = D - delta;

                circle.style.width = `${D}px`;
                circle.style.height = `${D}px`;
                circle.style.bottom = `-${delta}px`;

                gsap.set(circle, {
                    xPercent: -50,
                    scale: 0,
                    transformOrigin: `50% ${originY}px`
                });

                // Use class selectors that match the CSS module structure in DOM
                // Since we are using CSS modules, we need to target elements by their assigned class names
                // However, inside the component we use styles.className. 
                // But querySelector needs the actual class name.
                // A robust way is to use refs for labels too, but let's try to query by the structure or data attribute if possible.
                // Or simply assume the structure is stable.
                // The issue is that styles.pillLabel returns the hashed class name.
                // So we should use that hashed class name in querySelector.

                const label = pill.querySelector(`.${styles.pillLabel}`);
                const white = pill.querySelector(`.${styles.pillLabelHover}`);

                if (label) gsap.set(label, { y: 0 });
                if (white) gsap.set(white, { y: h + 12, opacity: 0 });

                // const index = circleRefs.current.indexOf(circle); // This might be unreliable if refs array has holes
                if (index === -1) return;

                tlRefs.current[index]?.kill();
                const tl = gsap.timeline({ paused: true });

                tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

                if (label) {
                    tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
                }

                if (white) {
                    gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
                    tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
                }

                tlRefs.current[index] = tl;
            });
        };

        // Delay layout slightly to ensure DOM is ready and fonts loaded
        const timer = setTimeout(layout, 100);

        const onResize = () => layout();
        window.addEventListener('resize', onResize);

        if ((document as any).fonts?.ready) {
            (document as any).fonts.ready.then(layout).catch(() => { });
        }

        const menu = mobileMenuRef.current;
        if (menu) {
            gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
        }

        return () => {
            window.removeEventListener('resize', onResize);
            clearTimeout(timer);
        };
    }, [items, ease]); // Removed initialLoadAnimation from deps

    // Initial Animation effect - runs only once on mount
    useEffect(() => {
        if (initialLoadAnimation) {
            const logo = logoRef.current;
            const navItems = navItemsRef.current;

            if (logo) {
                gsap.set(logo, { scale: 0 });
                gsap.to(logo, {
                    scale: 1,
                    duration: 0.6,
                    ease
                });
            }

            if (navItems) {
                gsap.set(navItems, { width: 0, overflow: 'hidden' });
                gsap.to(navItems, {
                    width: 'auto',
                    duration: 0.6,
                    ease
                });
            }
        }
    }, []); // Empty deps array ensures it only runs once

    const handleEnter = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
            duration: 0.3,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLeave = (i: number) => {
        const tl = tlRefs.current[i];
        if (!tl) return;
        activeTweenRefs.current[i]?.kill();
        activeTweenRefs.current[i] = tl.tweenTo(0, {
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const handleLogoEnter = () => {
        const el = logoImgRef.current;
        if (!el) return;
        logoTweenRef.current?.kill();
        gsap.set(el, { rotate: 0 });
        logoTweenRef.current = gsap.to(el, {
            rotate: 360,
            duration: 0.2,
            ease,
            overwrite: 'auto'
        });
    };

    const toggleMobileMenu = () => {
        const newState = !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);

        const hamburger = hamburgerRef.current;
        const menu = mobileMenuRef.current;

        if (hamburger) {
            const lines = hamburger.querySelectorAll(`.${styles.hamburgerLine}`);
            if (newState && lines.length >= 2) {
                gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
            } else if (lines.length >= 2) {
                gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
            }
        }

        if (menu) {
            if (newState) {
                gsap.set(menu, { visibility: 'visible' });
                gsap.fromTo(
                    menu,
                    { opacity: 0, y: 10, scaleY: 1 },
                    {
                        opacity: 1,
                        y: 0,
                        scaleY: 1,
                        duration: 0.3,
                        ease,
                        transformOrigin: 'top center'
                    }
                );
            } else {
                gsap.to(menu, {
                    opacity: 0,
                    y: 10,
                    scaleY: 1,
                    duration: 0.2,
                    ease,
                    transformOrigin: 'top center',
                    onComplete: () => {
                        gsap.set(menu, { visibility: 'hidden' });
                    }
                });
            }
        }

        onMobileMenuClick?.();
    };

    const isExternalLink = (href: string) =>
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#');

    const isRouterLink = (href: string) => href && !isExternalLink(href);

    // Helper to render logo image(s)
    const renderLogo = () => {
        if (logoDark) {
            return (
                <span ref={logoImgRef} className={styles.logoWrapper}>
                    <img src={logo} alt={logoAlt} className={themeStyles.lightImage} />
                    <img src={logoDark} alt={logoAlt} className={themeStyles.darkImage} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </span>
            );
        }
        return (
            <span ref={logoImgRef} className={styles.logoWrapper}>
                <img src={logo} alt={logoAlt} />
            </span>
        );
    };

    const cssVars = {
        '--base': baseColor,
        '--pill-bg': pillColor,
        '--hover-text': hoveredPillTextColor,
        '--pill-text': resolvedPillTextColor
    } as React.CSSProperties;

    return (
        <div className={styles.pillNavContainer}>
            <nav className={`${styles.pillNav} ${className}`} aria-label="Primary" style={cssVars}>
                {isRouterLink(items?.[0]?.href) ? (
                    <Link
                        className={styles.pillLogo}
                        href={items[0].href}
                        aria-label="Home"
                        onMouseEnter={handleLogoEnter}
                        role="menuitem"
                        ref={(el) => {
                            if (el) logoRef.current = el;
                        }}
                    >
                        {renderLogo()}
                    </Link>
                ) : (
                    <a
                        className={styles.pillLogo}
                        href={items?.[0]?.href || '#'}
                        aria-label="Home"
                        onMouseEnter={handleLogoEnter}
                        ref={(el) => {
                            if (el) logoRef.current = el;
                        }}
                    >
                        {renderLogo()}
                    </a>
                )}

                <div className={`${styles.pillNavItems} ${styles.desktopOnly}`} ref={navItemsRef}>
                    <ul className={styles.pillList} role="menubar">
                        {items.map((item, i) => (
                            <li key={item.href || `item-${i}`} role="none">
                                {isRouterLink(item.href) ? (
                                    <Link
                                        role="menuitem"
                                        href={item.href}
                                        className={`${styles.pill} ${activeHref === item.href ? styles.isActive : ''}`}
                                        aria-label={item.ariaLabel || item.label}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                    >
                                        <span
                                            className={styles.hoverCircle}
                                            aria-hidden="true"
                                            ref={(el) => {
                                                circleRefs.current[i] = el;
                                            }}
                                        />
                                        <span className={styles.labelStack}>
                                            <span className={styles.pillLabel}>{item.label}</span>
                                            <span className={styles.pillLabelHover} aria-hidden="true">
                                                {item.label}
                                            </span>
                                        </span>
                                    </Link>
                                ) : (
                                    <a
                                        role="menuitem"
                                        href={item.href}
                                        className={`${styles.pill} ${activeHref === item.href ? styles.isActive : ''}`}
                                        aria-label={item.ariaLabel || item.label}
                                        onMouseEnter={() => handleEnter(i)}
                                        onMouseLeave={() => handleLeave(i)}
                                    >
                                        <span
                                            className={styles.hoverCircle}
                                            aria-hidden="true"
                                            ref={(el) => {
                                                circleRefs.current[i] = el;
                                            }}
                                        />
                                        <span className={styles.labelStack}>
                                            <span className={styles.pillLabel}>{item.label}</span>
                                            <span className={styles.pillLabelHover} aria-hidden="true">
                                                {item.label}
                                            </span>
                                        </span>
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    className={`${styles.mobileMenuButton} ${styles.mobileOnly}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    ref={hamburgerRef}
                >
                    <span className={styles.hamburgerLine} />
                    <span className={styles.hamburgerLine} />
                </button>
            </nav>

            <div className={`${styles.mobileMenuPopover} ${styles.mobileOnly}`} ref={mobileMenuRef} style={cssVars}>
                <ul className={styles.mobileMenuList}>
                    {items.map((item, i) => (
                        <li key={item.href || `mobile-item-${i}`}>
                            {isRouterLink(item.href) ? (
                                <Link
                                    href={item.href}
                                    className={`${styles.mobileMenuLink} ${activeHref === item.href ? styles.isActive : ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <a
                                    href={item.href}
                                    className={`${styles.mobileMenuLink} ${activeHref === item.href ? styles.isActive : ''}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PillNav;
