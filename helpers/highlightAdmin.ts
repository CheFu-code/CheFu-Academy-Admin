export const roleToBadgeVariant = (role: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('admin')) return 'default';
    if (r.includes('manager')) return 'secondary';
    return 'outline';
};