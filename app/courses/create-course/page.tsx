'use client'

import CreateCourseUI from '@/components/pagesUI/CreateCourseUI';
import React, { useState } from 'react';

const CreateCourse = () => {
    const [topic, setTopic] = useState('');
    const [selectedTopics, setSelectedTopics] = useState('');
    return (
        <div>
            <CreateCourseUI
                topic={topic}
                setTopic={setTopic}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
            />
        </div>
    );
};

export default CreateCourse;
