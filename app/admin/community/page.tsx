import Header from '@/components/Shared/Header';
import { SearchForm } from '@/components/search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Hash, MessageSquare, UserPlus, Users } from 'lucide-react';
import { JSX } from 'react';

const Community = () => {
    return (
        <div className="p-6 w-full flex flex-col gap-6">
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between">
                <Header
                    header="Community Hub"
                    description="Engage, connect, and manage your academy community"
                />
                <Button className="cursor-pointer flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add Member
                </Button>
            </div>

            {/* COMMUNITY STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard
                    title="Total Members"
                    value="2,430"
                    icon={<Users className="h-6 w-6 text-blue-400" />}
                />
                <StatCard
                    title="Active Discussions"
                    value="184"
                    icon={<MessageSquare className="h-6 w-6 text-green-400" />}
                />
                <StatCard
                    title="Daily Interactions"
                    value="1,204"
                    icon={<Activity className="h-6 w-6 text-purple-400" />}
                />
                <StatCard
                    title="Topics Created"
                    value="68"
                    icon={<Hash className="h-6 w-6 text-yellow-400" />}
                />
            </div>

            {/* TABS */}
            <Tabs defaultValue="discussions" className="w-full">
                <TabsList>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* ----- DISCUSSIONS TAB ----- */}
                <TabsContent value="discussions" className="mt-6">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle>Community Discussions</CardTitle>
                            <SearchForm />
                        </CardHeader>
                        <CardContent>
                            <DiscussionList />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ----- MEMBERS TAB ----- */}
                <TabsContent value="members" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Community Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MembersList />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ----- ACTIVITY TAB ----- */}
                <TabsContent value="activity" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Latest Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityFeed />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Community;

const StatCard = ({
    title,
    value,
    icon,
}: {
    title: string;
    value: string;
    icon: JSX.Element;
}) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-semibold">{value}</p>
        </CardContent>
    </Card>
);

const DiscussionList = () => (
    <div className="flex flex-col gap-4">
        {[
            { title: 'How to improve cooking skills?', replies: 42 },
            { title: 'Best knives for beginners?', replies: 19 },
            { title: 'Where to find practice recipes?', replies: 64 },
        ].map((d, i) => (
            <div key={i} className="p-4 rounded-xl  transition">
                <p className=" font-medium">{d.title}</p>
                <p className="text-gray-400 text-sm mt-1">
                    {d.replies} replies
                </p>
            </div>
        ))}
    </div>
);

const MembersList = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((m) => (
            <div key={m} className="p-4 rounded-xl ">
                <p className=" font-medium">Member {m}</p>
                <p className="text-gray-400 text-sm mt-1">
                    Joined: 2 months ago
                </p>
            </div>
        ))}
    </div>
);

const ActivityFeed = () => (
    <div className="flex flex-col gap-4">
        {[
            'John Doe replied to a discussion',
            "New topic created: 'Beginner Recipes'",
            'Emily joined the community',
            'Mark commented on a video tutorial',
        ].map((a, i) => (
            <div key={i} className="p-3 rounded-xl ">
                <p className="text-gray-500 dark:text-gray-300">{a}</p>
            </div>
        ))}
    </div>
);
