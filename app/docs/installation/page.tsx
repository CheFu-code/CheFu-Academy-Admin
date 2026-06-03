'use client';

import getUserToken from '@/lib/getToken';
import { ApiKey } from '@/types/keys';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CreateDialog from '../_components/CreateDialog';
import { DocPage } from '../_components/DocPage';
import InstallationComp from '../_components/InstallationComp';
import { SDK_URL } from '@/constants/Data';

const toc = [
    { title: 'Install the package', href: '#install-package' },
    { title: 'Other SDK languages', href: '#other-sdk-languages' },
    { title: 'Login from the terminal', href: '#terminal-auth' },
    { title: 'Create an API key', href: '#create-api-key' },
    { title: 'Use the SDK', href: '#use-sdk' },
];

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
        <>
            <DocPage
                title="Installation"
                description="Install the SDK, authenticate from the terminal, create a developer key, and make your first CheFu Academy request."
                eyebrow="Getting Started"
                toc={toc}
            >
                <InstallationComp
                    setOpen={setOpen}
                    loading={loading}
                    keys={keys}
                    revokeKey={revokeKey}
                />
            </DocPage>
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
        </>
    );
}
