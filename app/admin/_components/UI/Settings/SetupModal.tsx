import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

const SetupModal = ({
    show2FAModal,
    setShow2FAModal,
    twoFACode,
    setTwoFACode,
    handleVerify2FA,
    qrDataUrl,
    secretText,
    loading,
}: {
    show2FAModal: boolean;
    setShow2FAModal: (value: boolean) => void;
    twoFACode: string;
    setTwoFACode: (value: string) => void;
    handleVerify2FA: () => void;
    qrDataUrl: string | null;
    secretText: string | null;
    loading: boolean;
}) => {
    return (
        <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Enable Admin Two-Factor Authentication
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                        Scan this QR in Google Authenticator / 1Password /
                        Authy, then enter the current 6‑digit code.
                    </p>

                    {qrDataUrl && (
                        <div className="flex items-center justify-center">
                            <Image
                                src={qrDataUrl}
                                alt="TOTP QR"
                                className="h-40 w-40"
                                width={40}
                                height={40}
                            />
                        </div>
                    )}

                    {secretText && (
                        <p className="text-xs text-gray-500 flex items-center">
                            Secret (fallback):{' '}
                            <span className="font-mono">{secretText}</span>
                            <button
                                type="button"
                                aria-label="Copy TOTP secret"
                                onClick={() => {
                                    navigator.clipboard.writeText(secretText);
                                    toast.success('Copied to clipboard');
                                }}
                                className="ml-2"
                            >
                                <Copy className="size-3 hover:text-primary" />
                            </button>
                        </p>
                    )}

                    <Input
                        placeholder="123456"
                        maxLength={6}
                        value={twoFACode}
                        onChange={(e) =>
                            setTwoFACode(e.target.value.replace(/\D/g, ''))
                        }
                    />

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShow2FAModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={twoFACode.length !== 6 || loading}
                            onClick={handleVerify2FA}
                        >
                            Verify & Enable
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SetupModal;
