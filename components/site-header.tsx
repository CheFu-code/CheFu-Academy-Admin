'use client';

import { SidebarIcon } from 'lucide-react';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import GlobalCourseSearch from './GlobalCourseSearch';
import { ThemeToggle } from './ui/themeToggle';

export function SiteHeader() {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
                <Button
                    className="h-8 w-8 cursor-pointer"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon />
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <Breadcrumb className="hidden sm:block">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    className="font-bold truncate"
                                    href="/"
                                >
                                    CheFu Academy
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <GlobalCourseSearch />
                    <div className="flex shrink-0 items-center justify-end">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
