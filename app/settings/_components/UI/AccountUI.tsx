import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as FirebaseU } from '@/types/user';
import { Bell, ShieldCheck, User } from 'lucide-react';
import React from 'react';
import NotificationsTab from '../NotificationsTab';
import ProfileTab from '../ProfileTab';
import SecurityTab from '../SecurityTab';

const AccountUI = ({
    handleChangeAvatar,
    user,
    changing,
    fileInputRef,
    handleAvatarUpload,
}: {
    user: FirebaseU | null;
    changing: boolean;
    handleChangeAvatar: () => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleAvatarUpload: (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => Promise<void>;
}) => {
    const roles = user?.roles?.length
        ? user.roles.map(
            role => role.charAt(0).toUpperCase() + role.slice(1),
        )
        : ['Anonymous'];

    return (
        <div className="container mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 shadow-sm sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0">
                        <Avatar
                            onClick={handleChangeAvatar}
                            className="relative h-14 w-14 cursor-pointer ring-2 ring-background sm:h-20 sm:w-20"
                        >
                            <AvatarImage
                                src={user?.profilePicture}
                                alt="User"
                            />
                            <AvatarFallback>
                                {user?.fullname?.[0] || 'CA'}
                            </AvatarFallback>

                            {changing && (
                                <div className="absolute inset-0 rounded-full bg-black/40" />
                            )}
                        </Avatar>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                    />

                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="space-y-1">
                            <h1 className="text-lg font-bold tracking-tight sm:text-2xl">
                                {user?.fullname || 'Unknown'}
                            </h1>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                Manage your profile, notifications, and account security.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {roles.map(role => (
                                <Badge key={role} variant="secondary">
                                    {role}
                                </Badge>
                            ))}
                            <span className="text-xs text-muted-foreground">
                                at CheFu Academy
                            </span>
                        </div>

                        {user?.bio && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {user.bio}
                            </p>
                        )}

                        <p className="text-xs text-muted-foreground">
                            Click your avatar to update your profile picture.
                        </p>
                    </div>
                </div>
            </div>

            <Separator className="my-2 sm:my-3" />

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl bg-muted/40 p-1">
                    <TabsTrigger
                        value="profile"
                        className="text-xs sm:text-sm"
                    >
                        <User className="mr-1 hidden h-3 w-3 sm:inline sm:h-4 sm:w-4" />{' '}
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="text-xs sm:text-sm"
                    >
                        <Bell className="mr-1 hidden h-3 w-3 sm:inline sm:h-4 sm:w-4" />{' '}
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="text-xs sm:text-sm"
                    >
                        <ShieldCheck className="mr-1 hidden h-3 w-3 sm:inline sm:h-4 sm:w-4" />{' '}
                        Security
                    </TabsTrigger>
                </TabsList>

                <ProfileTab />
                <NotificationsTab />
                <SecurityTab />
            </Tabs>
        </div>
    );
};

export default AccountUI;
