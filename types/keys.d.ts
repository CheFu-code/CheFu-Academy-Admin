export interface ApiKey {
    id: string;
    publicId?: string;
    prefix?: string;
    name: string;
    active: boolean;
    plan: string;
    createdAt?: TimestampLike | string | null;
    lastUsedAt?: TimestampLike | string | null;
}

type TimestampLike = {
    _seconds: number;
    _nanoseconds: number;
};
