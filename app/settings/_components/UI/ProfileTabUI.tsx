import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/user';
import {
    CalendarDays,
    Clock3,
    Copy,
    Globe2,
    Mail,
    MapIcon,
    ShieldCheck,
    Smartphone
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import countryList from 'react-select-country-list';
import { toast } from 'sonner';

const ProfileTabUI = ({
    user,
    name,
    setName,
    bio,
    setBio,
    updateField,
    updateCountry,
    saving,
    loggingOut,
    handleLogout,
}: {
    user: User;
    name: string;
    setName: (value: string) => void;
    bio: string;
    setBio: (value: string) => void;
    updateField: (field: 'fullname' | 'bio', value: string) => void;
    updateCountry: (countryCode: string) => void;
    saving: null | 'fullname' | 'bio' | 'country';
    loggingOut: boolean;
    handleLogout: () => void;
}) => {
    const countries = useMemo(() => countryList().getData(), []);
    const [countryCode, setCountryCode] = useState(user.countryCode || '');

    useEffect(() => {
        setCountryCode(user.countryCode || '');
    }, [user.countryCode]);

    const roles = user.roles?.length
        ? user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1))
        : ['Anonymous'];

    const createdDate = user.createdAt
        ? user.createdAt.toDate().toLocaleDateString()
        : 'N/A';

    const subscription = user.subscriptionStatus
        ? user.subscriptionStatus.toUpperCase()
        : 'N/A';
    const lastLogin = user.lastLogin
        ? user.lastLogin.toDate().toLocaleString()
        : 'N/A';

    const memberUntil = user.memberUntil
        ? user.memberUntil.toDate().toLocaleDateString()
        : 'N/A';

    const copyToClipboard = async (label: string, value: string) => {
        if (!value || value === 'N/A') {
            toast.error(`No ${label} available to copy.`);
            return;
        }
        try {
            await navigator.clipboard.writeText(value);
            toast.success(`${label} copied.`);
        } catch {
            toast.error(`Failed to copy ${label}.`);
        }
    };

    return (
        <TabsContent value="profile" className="mt-4 sm:mt-6">
            <Card className="border-border/60 shadow-sm">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-base sm:text-lg">Edit Profile</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        Update your personal details and review account information.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Basic Info
                        </h3>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    id="name"
                                    placeholder="Your display name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                                <Button
                                    className="cursor-pointer sm:w-24"
                                    size="sm"
                                    onClick={() => updateField('fullname', name)}
                                    disabled={
                                        name.trim() === user.fullname ||
                                        saving === 'fullname' ||
                                        !name.trim()
                                    }
                                >
                                    {saving === 'fullname' ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Input
                                    id="bio"
                                    placeholder="Tell us about yourself"
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                />
                                <Button
                                    className="cursor-pointer sm:w-24"
                                    size="sm"
                                    onClick={() => updateField('bio', bio)}
                                    disabled={
                                        bio.trim() === (user.bio || '') ||
                                        saving === 'bio' ||
                                        !bio.trim()
                                    }
                                >
                                    {saving === 'bio' ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Country</Label>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Select
                                    value={countryCode}
                                    onValueChange={setCountryCode}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-72">
                                        {countries.map(c => (
                                            <SelectItem key={c.value} value={c.value}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    className="cursor-pointer sm:w-24"
                                    size="sm"
                                    onClick={() => updateCountry(countryCode)}
                                    disabled={
                                        saving === 'country' ||
                                        !countryCode.trim() ||
                                        countryCode === (user.countryCode || '')
                                    }
                                >
                                    {saving === 'country' ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Email:</span>
                                <span className="text-muted-foreground">{user.email}</span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Email address changes are not permitted.
                            </p>
                            <div className="mt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard('Email', user.email)}
                                >
                                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                                    Copy Email
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Account Overview
                        </h3>

                        <div className="grid gap-2 text-sm">
                            <p className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Created:</span>
                                <span>{createdDate}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">Roles:</span>
                                {roles.map(role => (
                                    <Badge key={role} variant="secondary">
                                        {role}
                                    </Badge>
                                ))}
                            </div>

                            <p>
                                <span className="font-medium">Subscription:</span>{' '}
                                {subscription}
                            </p>
                            {user.member && (
                                <p>
                                    <span className="font-medium">Member Until:</span>{' '}
                                    {memberUntil}
                                </p>
                            )}

                            <p className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Verified:</span>
                                {user.isVerified ? (
                                    <Badge variant="default">Yes</Badge>
                                ) : (
                                    <Badge variant="destructive">No</Badge>
                                )}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Identity & Access
                        </h3>
                        <div className="grid gap-2 text-sm">
                            <p className="break-all">
                                <span className="font-medium">UID:</span> {user.uid || 'N/A'}
                            </p>
                            <p>
                                <span className="font-medium">Provider:</span>{' '}
                                {user.provider || 'N/A'}
                            </p>
                            <p>
                                <span className="font-medium">Onboarding Complete:</span>{' '}
                                {user.onboardingComplete ? 'Yes' : 'No'}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyToClipboard('UID', user.uid || 'N/A')}
                                >
                                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                                    Copy UID
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Activity & Locale
                        </h3>
                        <div className="grid gap-2 text-sm">
                            <p className="flex items-center gap-2">
                                <Globe2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Language:</span>{' '}
                                {user.language || 'N/A'}
                            </p>
                            <p className="flex items-center gap-2">
                                <MapIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Country:</span>{' '}
                                {user.country || 'N/A'}
                                {user.countryCode ? ` (${user.countryCode})` : ''}
                            </p>
                            <p className="flex items-center gap-2">
                                <Clock3 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Last Login:</span> {lastLogin}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Device Snapshot
                        </h3>
                        <div className="grid gap-2 text-sm">
                            <p className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Device:</span>{' '}
                                {user.deviceInfo?.deviceName ||
                                    user.deviceInfo?.deviceModel ||
                                    'N/A'}
                            </p>
                            <p>
                                <span className="font-medium">OS:</span>{' '}
                                {user.deviceInfo?.os || 'N/A'}{' '}
                                {user.deviceInfo?.osVersion
                                    ? `(${user.deviceInfo.osVersion})`
                                    : ''}
                            </p>
                            <p>
                                <span className="font-medium">Orientation:</span>{' '}
                                {user.deviceInfo?.orientation || 'N/A'}
                            </p>
                            <p>
                                <span className="font-medium">Screen:</span>{' '}
                                {user.deviceInfo?.screenWidth || 0} x{' '}
                                {user.deviceInfo?.screenHeight || 0}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <Button
                            disabled={loggingOut}
                            onClick={handleLogout}
                            variant="destructive"
                            className="cursor-pointer"
                        >
                            {loggingOut ? 'Logging Out...' : 'Log Out'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default ProfileTabUI;
