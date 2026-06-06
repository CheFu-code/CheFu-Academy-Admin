import { getApiUrl } from '@/lib/api-url';

export type ChefuSessionUser = {
    uid: string;
    email: string;
    roles: string[];
    displayName?: string | null;
    photoURL?: string | null;
};

const CHEFU_ACCOUNT_URL =
    process.env.NEXT_PUBLIC_CHEFU_ACCOUNT_URL || 'https://myaccount.chefuinc.com';
const ACADEMY_APP_URL =
    process.env.NEXT_PUBLIC_ACADEMY_APP_URL || 'https://academy.chefuinc.com';

function accountUrl(
    path: '/login' | '/register' | '/logout' | '/account',
    returnTo: string,
    options?: { section?: string },
) {
    const url = new URL(path, CHEFU_ACCOUNT_URL);
    url.searchParams.set('app', 'academy');
    url.searchParams.set('returnTo', returnTo);
    if (path === '/account' && options?.section) {
        url.searchParams.set('section', options.section);
    }
    return url.toString();
}

export function academyReturnTo(path = '/dashboard') {
    const base = ACADEMY_APP_URL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : '/dashboard';
    return `${base}${normalizedPath}`;
}

export function chefuLoginUrl(returnTo = academyReturnTo('/dashboard')) {
    return accountUrl('/login', returnTo);
}

export function chefuRegisterUrl(returnTo = academyReturnTo('/dashboard')) {
    return accountUrl('/register', returnTo);
}

export function chefuLogoutUrl(returnTo = academyReturnTo('/')) {
    return accountUrl('/logout', returnTo);
}

export function chefuManageAccountUrl(
    returnTo = academyReturnTo('/settings/account'),
    section?: string,
) {
    return accountUrl('/account', returnTo, { section });
}

export async function getChefuSessionUser() {
    const response = await fetch(getApiUrl('/auth/me'), {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Authentication required.');
    }

    const data = (await response.json()) as { user?: ChefuSessionUser };
    if (!data.user?.email) {
        throw new Error('Authentication required.');
    }

    return {
        ...data.user,
        displayName: data.user.displayName || data.user.email.split('@')[0],
        photoURL: data.user.photoURL || null,
    };
}
