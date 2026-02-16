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
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { User } from '@/types/user';
import { CalendarDays, Mail, ShieldCheck } from 'lucide-react';

const ProfileTabUI = ({
    user,
    name,
    setName,
    bio,
    setBio,
    updateField,
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
    saving: null | 'fullname' | 'bio';
    loggingOut: boolean;
    handleLogout: () => void;
}) => {
    const roles = user.roles?.length
        ? user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1))
        : ['Anonymous'];

    const createdDate = user.createdAt
        ? user.createdAt.toDate().toLocaleDateString()
        : 'N/A';

    const subscription = user.subscriptionStatus
        ? user.subscriptionStatus.toUpperCase()
        : 'N/A';

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

                        <div className="rounded-lg border bg-background p-3">
                            <p className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Email:</span>
                                <span className="text-muted-foreground">{user.email}</span>
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Email address changes are not permitted.
                            </p>
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
