export function normalizeText(input: unknown) {
    return String(input ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .trim();
}