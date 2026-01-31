export function getRoleText(roles: string[]) {
    if (!roles) return '';
    if (Array.isArray(roles)) return roles.join(', ');
    return String(roles);
}