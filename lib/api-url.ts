const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export function getApiUrl(path: string) {
    const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.chefuinc.com';
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${trimTrailingSlash(baseUrl)}${normalizedPath}`;
}
