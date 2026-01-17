import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'CheFu Academy | Smart Learners Platform',
    description: 'Smart Learning Starts Here',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Script
                        id="unicorn-studio"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `!(function () {
                                if (!window.UnicornStudio) {
                                    window.UnicornStudio = { isInitialized: !1 };
                                    var i = document.createElement('script');
                                    (i.src =
                                        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'),
                                        (i.onload = function () {
                                            window.UnicornStudio.isInitialized ||
                                                (UnicornStudio.init(),
                                                (window.UnicornStudio.isInitialized = !0));
                                        }),
                                        (document.head || document.body).appendChild(i);
                                }
                            })();
                            `,
                        }}
                    />
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
