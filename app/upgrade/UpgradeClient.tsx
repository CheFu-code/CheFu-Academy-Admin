'use client';

import { useSearchParams } from 'next/navigation';
import UpgradeUI from '@/components/pagesUI/UpgradeUI';

export default function UpgradeClient() {
    const searchParams = useSearchParams();
    const price = searchParams.get('price');
    const plan = searchParams.get('plan');

    if (!price || !plan) return null;

    return <UpgradeUI price={price} plan={plan} />;
}
