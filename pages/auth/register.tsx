import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import radixStyles from '../../styles/RadixTabs.module.css';
import { Google } from '../../components/icons/Google';

const HechunRegisterPage: React.FC = () => {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;
            alert('Registration successful! Please check your email to confirm your account.');
            router.push('/auth/login');
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
        <Layout title="Register - Hečhun">
            <div className="form-container" style={{ maxWidth: '450px' }}>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                    <p className="text-muted-foreground mb-8">Join us to start learning Kashmiri.</p>
                </div>


                <form onSubmit={handleRegister}>
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
                            minLength={6}
                        />
                    </fieldset>

                    {error && <p className="form-help-text text-red-500 mb-4">{error}</p>}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className={`${radixStyles.Button} ${radixStyles.ButtonBlue} w-full`}
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="w-full flex justify-center items-center py-2 px-4 border border-border rounded-md shadow-sm bg-card text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition"
                        >
                            <Google className="w-5 h-5 mr-3" />
                            Google
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default HechunRegisterPage;
