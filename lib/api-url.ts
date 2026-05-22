const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export function getApiUrl(path: string, localPath?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (!baseUrl) {
        return localPath || `/api${normalizedPath}`;
    }

    return `${trimTrailingSlash(baseUrl)}${normalizedPath}`;
}
