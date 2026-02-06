import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { Check, ChevronsUpDown, X, Lock } from 'lucide-react'; // ← Lock added
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Role = 'admin' | 'founder' | 'viewer' | 'support' | 'manager' | 'student';

function roleToBadgeVariant(role: string) {
    switch (role) {
        case 'admin':
            return 'destructive';
        case 'manager':
            return 'secondary';
        case 'founder':
            return 'default';
        case 'support':
            return 'outline';
        case 'viewer':
        case 'student':
        default:
            return 'outline';
    }
}

type EditableRolesCellProps = {
    userEmail: string;
    roles: string[]; // current roles from User.roles
    allRoles: Role[]; // allowed roles
    disabled?: boolean;
    className?: string;
    onSave: (userEmail: string, newRoles: string[]) => Promise<void>; // persist changes (Firestore/API)
};

const PROTECTED_ROLE: Role = 'admin';
const isProtected = (r: string) => r === PROTECTED_ROLE;

// (Optional) keep a stable display order based on allRoles
const sortByAllRoles = (roles: string[], allRoles: string[]) => {
    const rank = new Map(allRoles.map((r, i) => [r, i]));
    return [...roles].sort(
        (a, b) => (rank.get(a) ?? 999) - (rank.get(b) ?? 999),
    );
};

export const EditableRolesCell: React.FC<EditableRolesCellProps> = ({
    userEmail,
    roles,
    allRoles,
    disabled,
    className,
    onSave,
}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string[]>(
        sortByAllRoles(Array.from(new Set(roles ?? [])), allRoles),
    );
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [removingRole, setRemovingRole] = React.useState<string | null>(null);

    // Track if this user initially had admin; used to guard commit()
    const hadAdminInitiallyRef = React.useRef<boolean>(
        roles?.includes(PROTECTED_ROLE) ?? false,
    );

    // keep in sync if parent updates the roles from outside
    React.useEffect(() => {
        const next = Array.from(new Set(roles ?? []));
        setValue(sortByAllRoles(next, allRoles));
        hadAdminInitiallyRef.current = roles?.includes(PROTECTED_ROLE) ?? false;
    }, [roles, allRoles]);

    const ensureAtLeastOne = (next: string[]) => {
        if (next.length === 0) {
            toast.error('At least one role is required.');
            return false;
        }
        return true;
    };

    // Remove immediately with optimistic update + rollback
    const removeRole = async (r: string) => {
        // 🚫 Block removing protected role
        if (isProtected(r)) {
            toast.error('Admin role cannot be removed.');
            return;
        }

        const prev = value;
        if (!prev.includes(r)) return;

        if (prev.length === 1) {
            toast.error('At least one role is required.');
            return;
        }

        const next = sortByAllRoles(
            prev.filter((x) => x !== r),
            allRoles,
        );

        // Optimistic UI
        setRemovingRole(r);
        setValue(next);
        setError(null);

        try {
            setSaving(true);
            await onSave(userEmail, next);
            toast.success(`Removed ${r}`);
        } catch (e: unknown) {
            // Rollback on error
            setValue(prev);
            const msg =
                e instanceof Error ? e.message : 'Failed to update roles';
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
            setRemovingRole(null);
        }
    };

    const clearAll = () => {
        // If admin is present, disallow "clear"
        if (value.includes(PROTECTED_ROLE)) {
            toast.error('Cannot clear roles while admin is assigned.');
            return;
        }
        // Also block clearing to empty for non-admin sets if it would result in 0
        if (value.length <= 1) {
            toast.error('At least one role is required.');
            return;
        }
        toast.error('Clearing all roles is not allowed.');
        // setValue([]) // intentionally blocked
    };

    const cancel = () => {
        setValue(sortByAllRoles(Array.from(new Set(roles ?? [])), allRoles));
        setOpen(false);
        setError(null);
    };

    // Save button stays for non-instant changes made via the list
    const commit = async () => {
        const unique = Array.from(new Set(value));
        if (!ensureAtLeastOne(unique)) {
            setError('Select at least one role before saving.');
            return;
        }

        // 🛡️ If user originally had admin, ensure admin is still present
        if (hadAdminInitiallyRef.current && !unique.includes(PROTECTED_ROLE)) {
            // Re-add admin automatically and block save
            const fixed = sortByAllRoles([...unique, PROTECTED_ROLE], allRoles);
            setValue(fixed);
            setError('Admin role cannot be removed.');
            toast.error('Admin role cannot be removed.');
            return;
        }

        // no change
        const baseline = Array.from(new Set(roles ?? []));
        const same =
            unique.length === baseline.length &&
            unique.every((r) => baseline.includes(r));
        if (same) {
            setOpen(false);
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await onSave(userEmail, unique);
            setOpen(false);
            toast.success('Roles updated successfully.');
        } catch (e: unknown) {
            const msg =
                e instanceof Error ? e.message : 'Failed to update roles';
            setError(msg);
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const onKeyDownRoot: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (!open && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            if (!disabled) setOpen(true);
        }
        if (open && e.key === 'Escape') {
            e.preventDefault();
            cancel();
        }
    };

    return (
        <div
            className={cn('min-w-56', className)}
            role="button"
            tabIndex={0}
            onKeyDown={onKeyDownRoot}
        >
            <Popover open={open} onOpenChange={(o) => !disabled && setOpen(o)}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            'w-full justify-between gap-2 px-2 py-1 h-auto min-h-9',
                            disabled && 'cursor-not-allowed opacity-70',
                        )}
                        disabled={disabled}
                        title="Click to edit roles"
                    >
                        <div className="flex flex-wrap items-center gap-1">
                            {value.length > 0 ? (
                                value.map((r) => {
                                    const isRemoving =
                                        removingRole === r && saving;
                                    const protectedRole = isProtected(r);
                                    return (
                                        <Badge
                                            key={r}
                                            variant={roleToBadgeVariant(r)}
                                            className="capitalize pl-2 pr-1"
                                        >
                                            <span>{r}</span>

                                            {/* Admin: show lock, no X */}
                                            {protectedRole ? (
                                                <span
                                                    title="Admin role cannot be removed"
                                                    className="ml-1 -mr-0.5 inline-flex h-4 w-4 items-center justify-center opacity-70"
                                                >
                                                    <Lock className="h-3 w-3" />
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    title={`Remove ${r}`}
                                                    className={cn(
                                                        'ml-1 -mr-0.5 inline-flex h-4 w-4 items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer',
                                                        saving &&
                                                            isRemoving &&
                                                            'opacity-50 cursor-not-allowed',
                                                    )}
                                                    onClick={async (e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation(); // prevent opening popover
                                                        if (
                                                            saving &&
                                                            isRemoving
                                                        )
                                                            return;
                                                        await removeRole(r); // instant persist
                                                    }}
                                                    disabled={
                                                        saving && isRemoving
                                                    }
                                                >
                                                    {isRemoving ? (
                                                        <span className="block h-2 w-2 rounded-full animate-pulse bg-current" />
                                                    ) : (
                                                        <X className="size-3 cursor-pointer" />
                                                    )}
                                                </button>
                                            )}
                                        </Badge>
                                    );
                                })
                            ) : (
                                <span className="text-muted-foreground">
                                    No roles
                                </span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 opacity-60" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-70 p-0" align="start">
                    <Command>
                        <div className="flex items-center justify-between px-2 py-2">
                            <CommandInput placeholder="Search roles…" />
                            {value.length > 1 ? (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={clearAll}
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Clear
                                </Button>
                            ) : null}
                        </div>

                        <CommandList className="max-h-55">
                            <CommandEmpty>No roles found.</CommandEmpty>
                            <CommandGroup heading="Available roles">
                                {allRoles.map((r) => {
                                    const checked = value.includes(r);
                                    return (
                                        <CommandItem
                                            key={r}
                                            value={r}
                                            onSelect={() => {
                                                if (checked) {
                                                    // Already selected — keep same UX
                                                    toast.message(
                                                        `${r} is already selected.`,
                                                    );
                                                    return;
                                                }
                                                // Add role via list; user still needs to press Save
                                                setValue((prev) =>
                                                    sortByAllRoles(
                                                        Array.from(
                                                            new Set([
                                                                ...prev,
                                                                r,
                                                            ]),
                                                        ),
                                                        allRoles,
                                                    ),
                                                );
                                            }}
                                            className={cn(
                                                'flex items-center gap-2',
                                                checked &&
                                                    'opacity-60 pointer-events-none select-none',
                                            )}
                                            aria-disabled={checked}
                                        >
                                            <span
                                                className={cn(
                                                    'flex h-4 w-4 items-center justify-center rounded border',
                                                    checked
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-background',
                                                )}
                                            >
                                                {checked ? (
                                                    <Check className="h-3 w-3" />
                                                ) : null}
                                            </span>
                                            <span className="capitalize">
                                                {r}
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>

                        <CommandSeparator />
                        <div className="flex items-center justify-end gap-2 px-2 py-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancel}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={commit}
                                disabled={saving}
                            >
                                {saving ? 'Saving…' : 'Save'}
                            </Button>
                        </div>

                        {error ? (
                            <div className="px-3 pb-3 text-xs text-destructive">
                                {error}
                            </div>
                        ) : null}
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
