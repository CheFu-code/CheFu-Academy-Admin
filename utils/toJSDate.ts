export type TimestampLike = { toDate: () => Date };

function isTimestampLike(value: unknown): value is TimestampLike {
    return typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: unknown }).toDate === 'function';
}

export function toJsDate(value: unknown): Date | null {
    // Firestore Timestamp
    if (isTimestampLike(value)) {
        try {
            return value.toDate();
        } catch {
            return null;
        }
    }

    // JS Date
    if (value instanceof Date) return value;

    // Number (handle seconds vs ms)
    if (typeof value === 'number' && !Number.isNaN(value)) {
        // Heuristic: < 1e12 → seconds; ≥ 1e12 → milliseconds
        const ms = value < 1e12 ? value * 1000 : value;
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    // String (ISO or parseable)
    if (typeof value === 'string') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }

    return null;
}