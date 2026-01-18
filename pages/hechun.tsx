import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { ExternalLink, ArrowLeft, Sparkles } from 'lucide-react';

const HechunRedirectPage: React.FC = () => {
    return (
        <Layout title="Hečhun Has Moved" fullWidth={true}>
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
                {/* Animated gradient orbs background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="max-w-2xl w-full">
                    {/* Main content card */}
                    <div className="relative">
                        {/* Decorative border gradient */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-sm" />

                        <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-10 md:p-14 text-center">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-8 shadow-lg shadow-emerald-500/25">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                                Hečhun Has Moved
                            </h1>

                            {/* Description */}
                            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
                                Our Kashmiri learning platform now lives at its new home. Continue your language journey there!
                            </p>

                            {/* CTA Button */}
                            <a
                                href="https://hechun.tech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300"
                            >
                                Visit hechun.tech
                                <ExternalLink className="w-5 h-5" />
                            </a>

                            {/* Divider */}
                            <div className="flex items-center gap-4 my-10">
                                <div className="flex-1 h-px bg-border" />
                                <span className="text-muted-foreground text-sm">or</span>
                                <div className="flex-1 h-px bg-border" />
                            </div>

                            {/* Back link */}
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span>Explore Kashmiri Idioms on KashWords</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HechunRedirectPage;
