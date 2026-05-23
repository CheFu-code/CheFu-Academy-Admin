'use client';

export function arrayBufferToBase64(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
}

export async function saveNativeFile(payload: {
    title?: string;
    defaultPath?: string;
    data: string;
    encoding?: 'base64' | 'utf8';
    filters?: Array<{
        name: string;
        extensions: string[];
    }>;
}) {
    if (typeof window === 'undefined') return null;
    if (!window.chefuDesktop?.isElectron) return null;

    return window.chefuDesktop.saveFile(payload);
}

export async function importNativeLearningFile() {
    if (typeof window === 'undefined') return null;
    if (!window.chefuDesktop?.isElectron) return null;

    return window.chefuDesktop.importLearningFile();
}
