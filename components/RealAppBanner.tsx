"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { SiGoogleplay } from "react-icons/si"; // Google Play icon
import clsx from "clsx";

type RealAppBannerProps = React.HTMLAttributes<HTMLDivElement>;

const RealAppBanner: React.FC<RealAppBannerProps> = ({ className, ...props }) => {
    return (
        <Card
            className={clsx(
                "flex items-center gap-3 p-3 bg-sidebar-primary text-sidebar-primary-foreground shadow-sm rounded-lg border border-border cursor-pointer hover:bg-sidebar-primary/90 transition",
                className
            )}
            {...props}
        >
            <a
                href="https://play.google.com/store/apps/details?id=com.chefu.academy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
            >
                {/* Google Play Icon */}
                <SiGoogleplay className="w-6 h-6 text-green-400 shrink-0" />

                {/* Text */}
                <div className="flex flex-col">
                    <span className="text-xs font-medium leading-tight">Get it on</span>
                    <span className="text-sm font-semibold">Google Play</span>
                </div>
            </a>
        </Card>
    );
};

export default RealAppBanner;
