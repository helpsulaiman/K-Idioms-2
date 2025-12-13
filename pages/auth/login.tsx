import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import radixStyles from '../../styles/RadixTabs.module.css';

const HechunLoginPage: React.FC = () => {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            router.push('/hechun');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/hechun`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Layout title="Login - Hečhun">
            <div className="form-container" style={{ maxWidth: '450px' }}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-secondary mb-8">Sign in to continue your learning journey.</p>
                </div>


                <form onSubmit={handleLogin}>
                    <fieldset className={radixStyles.Fieldset}>
                        <label htmlFor="email" className={radixStyles.Label}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={radixStyles.Input}
                            required
                        />
                    </fieldset>
                    <fieldset className={radixStyles.Fieldset}>
                        <label htmlFor="password" className={radixStyles.Label}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={radixStyles.Input}
                            required
                        />
                    </fieldset>

                    {error && <p className="form-help-text text-red-500 mb-4">{error}</p>}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className={`${radixStyles.Button} ${radixStyles.ButtonBlue} w-full`}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                        >
                            Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin('facebook')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
                        >
                            Facebook
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default HechunLoginPage;
