'use client';
import { useParams } from 'next/navigation';
import React from 'react';

const Quiz = () => {
    const params = useParams();
    const id = params.id;
    return <div>quiz your id:{id}</div>;
};

export default Quiz;
