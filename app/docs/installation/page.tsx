'use client';

import Header from '@/components/Shared/Header';
import { Separator } from '@/components/ui/separator';
import getUserToken from '@/lib/getToken';
import { ApiKey } from '@/types/keys';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateDialog from '../_components/CreateDialog';
import InstallationComp from '../_components/InstallationComp';
import { SDK_URL } from '@/constants/Data';

export default function Installation() {
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
            if (!token) return;

            const res = await fetch(`${SDK_URL}/api/keys/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setKeys(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
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

            const res = await fetch(`${SDK_URL}/api/keys/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: keyName }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setGeneratedKey(data.apiKey);
            setKeyName('');
            fetchKeys();
        } catch {
            toast.error('Failed to create API key.');
        } finally {
            setGeneratingKey(false);
        }
    }

    async function revokeKey(id: string) {
        const token = await getUserToken();
        if (!token) {
            toast.error('You must be logged in.');
            return;
        }

        await fetch(`${SDK_URL}/api/keys/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ keyId: id }),
        });

        fetchKeys();
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header
                header="Installation & API Keys"
                description="Install the SDK, generate an API key, and start making requests."
            />

            <Separator className="my-10" />

            <InstallationComp
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
