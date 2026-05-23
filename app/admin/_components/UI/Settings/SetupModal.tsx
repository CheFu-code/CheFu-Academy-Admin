import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Download, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
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
    backupCodes = [],
    onBackupCodesSaved,
    confirmButtonText = 'Verify & Enable',
    title = 'Enable Admin Two-Factor Authentication',
    description = 'Scan this QR in Google Authenticator / 1Password / Authy, then enter the current 6-digit code.',
}: {
    show2FAModal: boolean;
    setShow2FAModal: (value: boolean) => void;
    twoFACode: string;
    setTwoFACode: (value: string) => void;
    handleVerify2FA: () => void;
    qrDataUrl: string | null;
    secretText: string | null;
    loading: boolean;
    backupCodes?: string[];
    onBackupCodesSaved?: () => void;
    confirmButtonText?: string;
    title?: string;
    description?: string;
}) => {
    const hasBackupCodes = backupCodes.length > 0;
    const backupCodeText = backupCodes.join('\n');

    const copyBackupCodes = async () => {
        await navigator.clipboard.writeText(backupCodeText);
        toast.success('Backup codes copied.');
    };

    const downloadBackupCodes = () => {
        const blob = new Blob(
            [
                [
                    'CheFu Academy recovery backup codes',
                    'Store these somewhere safe. Each code can only be used once.',
                    '',
                    backupCodeText,
                    '',
                ].join('\n'),
            ],
            { type: 'text/plain;charset=utf-8' },
        );
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'chefu-academy-backup-codes.txt';
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog
            open={show2FAModal}
            onOpenChange={(open) => {
                if (!open && hasBackupCodes) {
                    onBackupCodesSaved?.();
                    return;
                }
                setShow2FAModal(open);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {hasBackupCodes ? 'Save Your 2FA Backup Codes' : title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    {hasBackupCodes ? (
                        <>
                            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-muted-foreground">
                                <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                                    <ShieldCheck className="h-4 w-4 text-green-600" />
                                    2FA is enabled
                                </div>
                                These recovery codes are shown only once. Save them
                                somewhere private before closing this dialog.
                            </div>

                            <div className="grid grid-cols-1 gap-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                                {backupCodes.map(code => (
                                    <code
                                        key={code}
                                        className="rounded border bg-background px-3 py-2 text-center text-sm font-semibold tracking-wider"
                                    >
                                        {code}
                                    </code>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={copyBackupCodes}
                                >
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={downloadBackupCodes}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </Button>
                                <Button type="button" onClick={onBackupCodesSaved}>
                                    I Saved Them
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500">
                                {description}
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
                                <p className="flex items-center text-xs text-gray-500">
                                    Secret (fallback):{' '}
                                    <span className="font-mono">{secretText}</span>
                                    <button
                                        type="button"
                                        aria-label="Copy TOTP secret"
                                        onClick={() => {
                                            void navigator.clipboard.writeText(secretText);
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
                                    {confirmButtonText}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SetupModal;
