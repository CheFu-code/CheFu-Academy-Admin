import Header from '@/components/Shared/Header';
import { Separator } from '@/components/ui/separator';
import React from 'react';

const page = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header
                header="CheFu Academy SDK Docs"
                description="Welcome to the CheFu Academy SDK documentation!"
            />

            <Separator className="mt-10 mb-10" />
            <div>
                <h1 className="text-xl font-bold">What is CheFu Academy?</h1>
                <p className="mt-5">
                    CheFu Academy is a feature reach learning platform available
                    on{' '}
                    <a
                        target="_blank"
                        href="https://chefuacademy.vercel.app"
                        className="text-primary hover:underline"
                    >
                        Web
                    </a>{' '}
                    and{' '}
                    <a
                        target="_blank"
                        href="https://play.google.com/store/apps/details?id=com.chefu.chefuacademy"
                        className="text-primary hover:underline"
                    >
                        Android
                    </a>
                </p>
            </div>
            <Separator className="mt-10 mb-10" />

            <div>
                <h1 className="text-xl font-bold">How to use the docs</h1>
                <p className="mt-5">The docs are organized</p>
            </div>
        </div>
    );
};

export default page;
