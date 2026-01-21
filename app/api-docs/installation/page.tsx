'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import getUserToken from '@/lib/getToken';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateDialog from '../_components/CreateDialog';

// Types
interface ApiKey {
    id: string;
    name: string;
    active: boolean;
    plan: string;
    lastUsedAt?: string;
}

export default function ApiKeysDashboard() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyName, setKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [generatingKey, setGeneratingKey] = useState<boolean>(false);

    // 🔄 Fetch keys

    async function fetchKeys() {
        const res = await fetch('http://localhost:4000/api/keys/list', {
            headers: {
                Authorization: `Bearer ${await getUserToken()}`, // important
            },
        });
        const data = await res.json();
        if (!Array.isArray(data)) {
            console.error('Expected array, got:', data);
            setKeys([]);
            return;
        }
        setKeys(data);
    }
    fetchKeys();

    useEffect(() => {
        fetchKeys();
    }, []);

    // ➕ Create key
    async function createKey() {
        setGeneratingKey(true);
        try {
            const res = await fetch('http://localhost:4000/api/keys/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: keyName }),
            });

            const data = await res.json();
            setGeneratedKey(data.apiKey);
            setKeyName('');
            fetchKeys();
        } catch (error) {
            console.error('Error creating API key:', error);
            toast.error('Failed to create API key. Please try again.');
        } finally {
            setGeneratingKey(false);
        }
    }

    // ❌ Revoke key
    async function revokeKey(id: string) {
        await fetch('http://localhost:4000/api/keys/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyId: id }),
        });

        fetchKeys();
    }

    return (
        <div className="min-h-screen bg-background">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>API Keys</CardTitle>
                    <Button
                        size={'sm'}
                        className="cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        Create API Key
                    </Button>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.map((key) => (
                                <TableRow key={key.id}>
                                    <TableCell>{key.name}</TableCell>
                                    <TableCell>
                                        {key.active ? (
                                            <Badge>Active</Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Revoked
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{key.plan}</TableCell>
                                    <TableCell>
                                        {key.lastUsedAt || '—'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {key.active && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    revokeKey(key.id)
                                                }
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {loading && (
                        <p className="text-sm text-muted-foreground mt-2">
                            Loading...
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* ➕ Create Dialog */}
            <CreateDialog
                open={open}
                setOpen={setOpen}
                keyName={keyName}
                setKeyName={setKeyName}
                generatedKey={generatedKey}
                setGeneratedKey={setGeneratedKey}
                generatingKey={generatingKey}
                createKey={createKey}
            />
        </div>
    );
}
