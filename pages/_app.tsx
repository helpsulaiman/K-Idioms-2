import { useState } from 'react';
import type { AppProps } from 'next/app';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import localFont from 'next/font/local';
import '../styles/globals.css';
import '../styles/MagicBento.css';
import '../styles/TiltedCard.css';
import '../styles/GradientText.css';

const kashmiriFont = localFont({
    src: '../styles/fonts/NNU.ttf', // 3. Set the path to your font file
    variable: '--font-kashmiri', // 4. This creates a CSS variable for the font
});

function App({ Component, pageProps }: AppProps<{ initialSession: Session }>) {
    const [supabaseClient] = useState(() => createPagesBrowserClient());

    return (
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
            <div className={`${kashmiriFont.variable}`}>
                {/* This line is the fix. It renders the actual page you are visiting. */}
                <Component {...pageProps} />
            </div>
        </SessionContextProvider>
    );
}

export default App;