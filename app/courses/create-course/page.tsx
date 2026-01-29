'use client';

import CreateCourseUI from '@/components/pagesUI/CreateCourseUI';
import { useGenerateTopic } from '@/hooks/useGenerateTopic';
import React, { useRef, useState } from 'react';

const CreateCourse = () => {
     const mainWrapperRef = useRef<HTMLDivElement>(null);
    const [userInput, setUserInput] = useState('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const {
        generateTopic,
        generatingTopic,
        topics,
        setTopics,
        onGenerateCourse,
        generatingCourse,
    } = useGenerateTopic(userInput, setUserInput);
    return (
        <div>
            <CreateCourseUI
                topics={topics}
                setTopics={setTopics}
                userInput={userInput}
                setUserInput={setUserInput}
                generatingTopic={generatingTopic}
                generateTopic={generateTopic}
                selectedTopics={selectedTopics}
                generatingCourse={generatingCourse}
                onGenerateCourse={() => onGenerateCourse(selectedTopics)}
                setSelectedTopics={setSelectedTopics}
                mainWrapperRef={mainWrapperRef}
            />
        </div>
    );
};

export default CreateCourse;
