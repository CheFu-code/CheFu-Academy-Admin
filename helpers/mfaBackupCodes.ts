const BACKUP_CODE_COUNT = 10;
const BACKUP_CODE_BYTES = 5;

function toBase32(bytes: Uint8Array) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let bits = 0;
    let value = 0;
    let output = '';

    for (const byte of bytes) {
        value = (value << 8) | byte;
        bits += 8;

        while (bits >= 5) {
            output += alphabet[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }

    if (bits > 0) {
        output += alphabet[(value << (5 - bits)) & 31];
    }

    return output;
}

function formatCode(raw: string) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

async function sha256(value: string) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);

    return [...new Uint8Array(digest)]
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export function generateMfaBackupCodes() {
    const codes = new Set<string>();

    while (codes.size < BACKUP_CODE_COUNT) {
        const bytes = new Uint8Array(BACKUP_CODE_BYTES);
        crypto.getRandomValues(bytes);
        codes.add(formatCode(toBase32(bytes).slice(0, 8)));
    }

    return [...codes];
}

export async function hashMfaBackupCodes(codes: string[], salt: string) {
    return Promise.all(
        codes.map(async code => ({
            hash: await sha256(`${salt}:${normalizeMfaBackupCode(code)}`),
            usedAt: null,
        })),
    );
}

export function normalizeMfaBackupCode(code: string) {
    return code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}
