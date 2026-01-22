// chefu-academy-web/app/api-installation/page.tsx

'use client';

import getUserToken from '@/lib/getToken';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateDialog from '../_components/CreateDialog';
import TableComp from '../_components/Table';
import { ApiKey } from '@/types/keys';
import Header from '@/components/Shared/Header';

export default function ApiKeysDashboard() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [keyName, setKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [generatingKey, setGeneratingKey] = useState<boolean>(false);

    async function fetchKeys() {
        setLoading(true);
        try {
            const token = await getUserToken();
            if (!token) {
                console.error('No token found, user might not be logged in.');
                return;
            }

            const res = await fetch('https://chefu-academy-sdk.onrender.com/api/keys/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error('Expected array, got:', data);
                setKeys([]);
                return;
            }

            setKeys(data);
        } catch (error) {
            console.error('Error fetching keys:', error);
            setKeys([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchKeys();
    }, []);

    async function createKey() {
        setGeneratingKey(true);
        try {
            const token = await getUserToken();
            if (!token) {
                toast.error('You must be logged in to create an API key.');
                return;
            }

            const res = await fetch('https://chefu-academy-sdk.onrender.com/api/keys/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: keyName }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create API key');
            }

            setGeneratedKey(data.apiKey);
            setKeyName('');
            fetchKeys(); // refresh list
        } catch (error) {
            console.error('Error creating API key:', error);
            toast.error('Failed to create API key. Please try again.');
        } finally {
            setGeneratingKey(false);
        }
    }

    async function revokeKey(id: string) {
        const token = await getUserToken();
        if (!token) {
            toast.error('You must be logged in to revoke an API key.');
            return;
        }

        const res = await fetch('https://chefu-academy-sdk.onrender.com/api/keys/revoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ keyId: id }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Failed to revoke API key');
        }

        fetchKeys();
    }

    return (
        <div className="min-h-screen bg-background">
            <Header header='API Docs' description=''/>
            <TableComp
                setOpen={setOpen}
                loading={loading}
                keys={keys}
                revokeKey={revokeKey}
            />

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
