'use client'

import PracticeUI from '@/components/Practice/UI/PracticeUI';
import { useRouter } from 'next/navigation';

const PracticePage = () => {
    const router = useRouter();
    return <PracticeUI router={router} />;
};

export default PracticePage;
