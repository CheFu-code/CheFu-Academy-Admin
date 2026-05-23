'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
} from 'firebase/firestore';
import { Activity, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

type SecurityEvent = {
    id: string;
    type: string;
    createdAt?: Timestamp;
    details?: Record<string, unknown>;
};

const eventLabels: Record<string, string> = {
    sign_in: 'Sign-in',
    password_changed: 'Password changed',
    passkey_enrolled: 'Passkey enrolled',
    mfa_enabled: '2FA enabled',
    mfa_disabled: '2FA disabled',
    verification_email_sent: 'Verification email sent',
};

export default function SecurityEventLog() {
    const [events, setEvents] = useState<SecurityEvent[]>([]);

    useEffect(() => {
        let unsubscribeEvents: (() => void) | undefined;

        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            unsubscribeEvents?.();
            if (!user?.email) {
                setEvents([]);
                return;
            }

            const eventsQuery = query(
                collection(db, 'users', user.email, 'securityEvents'),
                orderBy('createdAt', 'desc'),
                limit(8),
            );

            unsubscribeEvents = onSnapshot(eventsQuery, snapshot => {
                setEvents(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...(doc.data() as Omit<SecurityEvent, 'id'>),
                    })),
                );
            });
        });

        return () => {
            unsubscribeAuth();
            unsubscribeEvents?.();
        };
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="size-4 text-cyan-500" />
                    Security Event Log
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {events.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Security events will appear here after sign-ins and account changes.
                    </p>
                )}

                {events.map(event => (
                    <div
                        key={event.id}
                        className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-background">
                                <EventIcon type={event.type} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {eventLabels[event.type] || event.type}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatEventDate(event.createdAt)}
                                </p>
                            </div>
                        </div>
                        <Badge variant="outline">
                            {String(event.details?.provider || 'account')}
                        </Badge>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function EventIcon({ type }: { type: string }) {
    if (type === 'password_changed') {
        return <LockKeyhole className="size-4 text-cyan-500" />;
    }
    if (type === 'passkey_enrolled') {
        return <KeyRound className="size-4 text-cyan-500" />;
    }
    return <ShieldCheck className="size-4 text-cyan-500" />;
}

function formatEventDate(value?: Timestamp) {
    if (!value?.toDate) return 'Just now';

    return value.toDate().toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
