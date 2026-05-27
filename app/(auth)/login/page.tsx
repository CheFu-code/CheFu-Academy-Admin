import { Suspense } from 'react';
import { CentralLoginRedirect } from './CentralLoginRedirect';

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <CentralLoginRedirect />
        </Suspense>
    );
}
