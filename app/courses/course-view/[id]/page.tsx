'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const CourseView = () => {
    const router = useRouter();
    const params = useParams();

    return <div>page view {params.id}</div>;
};

export default CourseView;
