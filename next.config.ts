import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
        ],
    },
    async rewrites() {
        const region =
            process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'us-central1';
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

        if (!projectId) {
            return [];
        }

        return [
            {
                source: '/firebase-web-authn-api',
                destination: `https://${region}-${projectId}.cloudfunctions.net/ext-firebase-web-authn-api`,
            },
        ];
    },
};

export default nextConfig;
