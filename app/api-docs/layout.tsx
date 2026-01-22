'use client';

import APISidebar from '@/components/APIDoc/APISidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const APILayout = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuthUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            toast.warning('Please login');
            router.replace('/login');
        }
    }, [loading, user, router]);
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader />
                <div className="flex flex-1">
                    <APISidebar />
                    <SidebarInset>
                        <div className="flex flex-1 flex-col gap-4 p-4">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    );
};

export default APILayout;
