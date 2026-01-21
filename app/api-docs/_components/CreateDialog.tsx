import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React, { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

const CreateDialog = ({
    open,
    setOpen,
    keyName,
    setKeyName,
    generatedKey,
    setGeneratedKey,
    generatingKey,
    createKey,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    keyName: string;
    setKeyName: Dispatch<SetStateAction<string>>;
    generatedKey: string | null;
    setGeneratedKey: Dispatch<SetStateAction<string | null>>;
    generatingKey: boolean;
    createKey(): Promise<void>
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create API Key</DialogTitle>
                </DialogHeader>

                {generatedKey ? (
                    <div className="space-y-3">
                        <p className="text-sm text-red-500 font-medium">
                            Copy this key now. You won’t see it again.
                        </p>
                        <Input value={generatedKey} readOnly />
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(generatedKey);
                                toast.success('API Key copied to clipboard');
                                setGeneratedKey(null);
                                setOpen(false);
                            }}
                        >
                            Copy & Close
                        </Button>
                    </div>
                ) : (
                    <>
                        <Input
                            placeholder="Key name (e.g. My App)"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                        />
                        <DialogFooter>
                            <Button
                                size={'sm'}
                                className="cursor-pointer"
                                onClick={createKey}
                                disabled={!keyName || generatingKey}
                            >
                                {generatingKey ? 'Generating...' : 'Generate'}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreateDialog;
