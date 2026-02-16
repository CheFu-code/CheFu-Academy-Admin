export const normalizeFromAddress = (raw: string): string | null => {
    const value = raw.trim();
    if (!value) return null;

    if (/\S+@\S+\.\S+/.test(value) && (value.includes('<') || !value.includes(' '))) {
        return value;
    }

    const emailMatch = value.match(/([^\s<>]+@[^\s<>]+\.[^\s<>]+)$/);
    if (!emailMatch) return null;
    const email = emailMatch[1];
    const name = value.slice(0, value.length - email.length).trim();
    if (!name) return email;
    return `${name} <${email}>`;
};

