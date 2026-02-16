import type { AuthenticatorTransportFuture } from '@simplewebauthn/server';

export type Passkey = {
    id: string;
    publicKey: Buffer;
    counter: number;
    deviceType: 'singleDevice' | 'multiDevice';
    backedUp: boolean;
    transports?: AuthenticatorTransportFuture[];
    webauthnUserID: string;
};

export type SignInDevice = {
    key: string;
    label: string;
    firstSeenAt: string;
    lastSeenAt: string;
    lastIpAddress: string;
    credentialId: string;
    origin: string;
};

export type WebAuthnUserDoc = {
    username: string;
    challenge?: string | null;
    credentials: Passkey[];
    signInDevices?: SignInDevice[];
};

export type AppUserDoc = {
    emailPreferences?: {
        security?: boolean;
    };
};

