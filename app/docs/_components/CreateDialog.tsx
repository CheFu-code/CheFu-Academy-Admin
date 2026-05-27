import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';
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
    createKey(): Promise<void>;
}) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="border-white/10 bg-[#0b0b0b] text-white">
                <DialogHeader>
                    <DialogTitle>Create API key</DialogTitle>
                </DialogHeader>

                {generatedKey ? (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-amber-300">
                            Copy this key now. You will not see it again.
                        </p>
                        <Input
                            value={generatedKey}
                            readOnly
                            className="border-white/10 bg-black font-mono text-sm text-zinc-100"
                        />
                        <Button
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(generatedKey);
                                toast.success('API key copied to clipboard');
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
                            placeholder="Key name (e.g. Local development)"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                            className="border-white/10 bg-black text-white placeholder:text-zinc-500"
                        />
                        <DialogFooter>
                            <Button
                                size="sm"
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
