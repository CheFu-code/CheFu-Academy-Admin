const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export function getApiUrl(path: string) {
    const baseUrl =
        process.env.NODE_ENV === 'development'
            ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL || 'http://localhost:4000'
            : process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chefuinc.com';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${trimTrailingSlash(baseUrl)}${normalizedPath}`;
}
