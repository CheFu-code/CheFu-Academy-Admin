'use client';

import { useParams } from 'next/navigation';

const Flashcard = () => {
    const params = useParams();
    const id = params.id;
    return <div>your id:{id}</div>;
};

export default Flashcard;
