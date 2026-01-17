'use client';

import UpgradeUI from '@/components/pagesUI/UpgradeUI';
import { useSearchParams } from 'next/navigation';

const Upgrade = () => {
    const searchParams = useSearchParams();
    const price = searchParams.get('price');
    const plan = searchParams.get('plan');
    if (!price || !plan) return;
    return (
        <div>
            <UpgradeUI price={price} plan={plan} />
        </div>
    );
};

export default Upgrade;
