'use client';

import CreateCourseUI from '@/components/pagesUI/CreateCourseUI';
import { useGenerateTopic } from '@/hooks/useGenerateTopic';
import { importNativeLearningFile } from '@/lib/desktop-files';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';

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

    const handleImportLearningFile = async () => {
        const result = await importNativeLearningFile();
        if (!result || result.canceled) return;

        const text = result.text?.trim();
        if (!text) {
            toast.error('Could not read text from that file.');
            return;
        }

        setUserInput(
            `Create a course from this imported file (${result.fileName}):\n\n${text.slice(0, 12000)}`,
        );
        toast.success('Learning material imported.');
    };

    return (
        <div>
            <CreateCourseUI
                topics={topics}
                setTopics={setTopics}
                userInput={userInput}
                setUserInput={setUserInput}
                generatingTopic={generatingTopic}
                generateTopic={generateTopic}
                onImportLearningFile={
                    typeof window !== 'undefined' && window.chefuDesktop?.isElectron
                        ? handleImportLearningFile
                        : undefined
                }
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
