'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthUser } from '@/hooks/useAuthUser';
import { Bell, Loader, ShieldCheck, User } from 'lucide-react';
import NotificationsTab from '../_components/NotificationsTab';
import ProfileTab from '../_components/ProfileTab';
import SecurityTab from '../_components/SecurityTab';

const Account = () => {
    const { user, loading } = useAuthUser();

    return (
        <div className="container mx-auto max-w-4xl p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-4">
                <div className="flex flex-col items-start space-y-1 sm:space-y-2 w-full min-w-0">
                    <div className="flex flex-row items-center">
                        <Avatar className="h-10 w-10 sm:h-16 sm:w-16 mr-2">
                            <AvatarImage
                                src={user?.profilePicture}
                                alt="User"
                            />
                            <AvatarFallback>
                                {user?.fullname?.[0] || 'CA'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            {loading ? (
                                <Loader className="animate-spin size-4" />
                            ) : (
                                <h1 className="text-base sm:text-2xl font-bold">
                                    <button className="cursor-pointer">
                                        {user?.fullname || 'Unknown'}{' '}
                                    </button>
                                </h1>
                            )}
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                {user?.roles[0] || 'anonymous'} at CheFu Academy
                            </p>
                        </div>
                    </div>
                    {user?.bio && (
                        <p className="text-muted-foreground truncate w-full">
                            {user?.bio}
                        </p>
                    )}
                </div>
            </div>

            <Separator className="my-3 sm:my-4" />

            {/* Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="flex w-full overflow-x-auto no-scrollbar space-x-1 sm:space-x-2 px-1 sm:px-2">
                    <TabsTrigger
                        value="profile"
                        className="flex-shrink-0 min-w-[50px] text-xs sm:text-sm"
                    >
                        <User className="mr-1 h-3 w-3 sm:h-4 sm:w-4 hidden sm:inline" />{' '}
                        Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex-shrink-0 min-w-[55px] text-xs sm:text-sm"
                    >
                        <Bell className="mr-1 h-3 w-3 sm:h-4 sm:w-4 hidden sm:inline" />{' '}
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex-shrink-0 min-w-[50px] text-xs sm:text-sm"
                    >
                        <ShieldCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4 hidden sm:inline" />{' '}
                        Security
                    </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <ProfileTab />
                <NotificationsTab />
                <SecurityTab />
            </Tabs>
        </div>
    );
};

export default Account;
