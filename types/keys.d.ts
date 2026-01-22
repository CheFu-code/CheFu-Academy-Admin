export interface ApiKey {
    id: string;
    name: string;
    active: boolean;
    plan: string;
    lastUsedAt?: string;
}
