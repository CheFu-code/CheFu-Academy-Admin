const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const defaultApiBaseUrl =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://api.chefuinc.com';

export function getApiUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${trimTrailingSlash(baseUrl)}${normalizedPath}`;
}
