import { normalizeText } from "./text";

export function parseQuery(raw: string) {
    const q = normalizeText(raw);
    if (!q)
        return {
            terms: [] as string[],
            filters: {} as Record<string, string[]>,
        };

    const parts = q.split(/\s+/).filter(Boolean);
    const filters: Record<string, string[]> = {};
    const terms: string[] = [];

    for (const p of parts) {
        const idx = p.indexOf(':');
        if (idx > 0) {
            const key = p.slice(0, idx);
            const val = p.slice(idx + 1);
            if (!val) continue;
            (filters[key] ??= []).push(val);
        } else {
            terms.push(p);
        }
    }

    return { terms, filters };
}