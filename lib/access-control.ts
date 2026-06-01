export const ADMIN_ROLE = 'admin';

export function hasRole(roles: string[] | undefined, role: string) {
    return Boolean(
        roles?.some(
            userRole => userRole.toLowerCase() === role.toLowerCase(),
        ),
    );
}

export function isAdmin(roles: string[] | undefined) {
    return hasRole(roles, ADMIN_ROLE);
}
