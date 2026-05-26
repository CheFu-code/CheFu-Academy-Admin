import type { NextConfig } from 'next';

const staticExport =
    process.env.STATIC_EXPORT === '1' ||
    process.env.ELECTRON_STATIC_EXPORT === '1';

const nextConfig: NextConfig = {
    /* config options here */
    output: staticExport ? 'export' : 'standalone',
    assetPrefix: staticExport ? './' : undefined,
    trailingSlash: staticExport ? true : undefined,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        unoptimized: staticExport,
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
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.resolve = config.resolve || {};
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                https: false,
                'node:fs': false,
                'node:https': false,
            };
            config.plugins = config.plugins || [];
            config.plugins.push(
                new webpack.NormalModuleReplacementPlugin(
                    /^node:/,
                    (resource: { request: string }) => {
                        resource.request = resource.request.replace(/^node:/, '');
                    },
                ),
            );
        }

        return config;
    },
};

export default nextConfig;
