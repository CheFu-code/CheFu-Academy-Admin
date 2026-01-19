'use client';

import { useParams } from 'next/navigation';
import React from 'react';

const QuestionAns = () => {
    const params = useParams();
    const id = params.id;
    return <div>QuestionAns id:{id}</div>;
};

export default QuestionAns;
