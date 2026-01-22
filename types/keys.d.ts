export interface ApiKey {
    id: string;
    name: string;
    active: boolean;
    plan: string;
    lastUsedAt?: {
      _seconds: number;
      _nanoseconds: number;
    } | string | null;
  }
  