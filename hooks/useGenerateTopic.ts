'use client';

import { generateCourse, generateTopics } from '@/config/AIModel';
import Prompt from '@/constants/Prompt';
import React, { useState } from 'react';
import { useAuthUser } from './useAuthUser';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useGenerateTopic = (
    userInput: string,
    setUserInput: React.Dispatch<React.SetStateAction<string>>,
) => {
    const router = useRouter();
    const { user } = useAuthUser();
    const [topics, setTopics] = useState<string[]>([]);
    const [generatingTopic, setGeneratingTopic] = useState(false);
    const [generatingCourse, setGeneratingCourse] = useState(false);

    const generateTopic = async () => {
        if (generatingTopic) return;
        if (!userInput.trim()) {
            toast.error('Please enter a course idea first.');
            return;
        }

        setGeneratingTopic(true);

        let topicIdea = [];
        try {
            const promptText = userInput + Prompt.IDEA;
            const contents = [
                {
                    role: 'user',
                    parts: [{ text: promptText }],
                },
            ];
            const aiResponse = await generateTopics(contents);
            const cleanedResponse =
                aiResponse && typeof aiResponse === 'string'
                    ? aiResponse.replace(/^```json[\r\n]+|```$/gi, '').trim()
                    : aiResponse;

            if (!cleanedResponse || cleanedResponse.trim() === '') {
                toast.error("The AI didn't return any topic ideas.");
                topicIdea = [];
                return;
            }

            function safeJsonParse(json: string) {
                try {
                    return JSON.parse(json);
                } catch {
                    return null;
                }
            }

            topicIdea = safeJsonParse(cleanedResponse) || [];
            setUserInput('');
            console.log('Generated Topics:', topicIdea);
        } catch (error) {
            console.error('Error generating topic:', error);
            toast.error(`Failed to generate topic. Please try again. ${error}`);
            topicIdea = [];
        } finally {
            setTopics(Array.isArray(topicIdea) ? topicIdea : []);
            setGeneratingTopic(false);
        }
    };

    const onGenerateCourse = async (selectedTopics: string[]) => {
        if (generatingCourse) return;
        if (!selectedTopics.length) {
            toast.error('Please select at least one topic.');
            return;
        }

        setGeneratingCourse(true);

        const promptText = selectedTopics.join(', ') + Prompt.COURSE;
        const contents = [
            {
                role: 'user',
                parts: [{ text: promptText }],
            },
        ];

        try {
            const aiResp = await generateCourse(contents);

            if (!aiResp || aiResp.trim() === '') {
                toast.error("The AI didn't return any course content.");
                return;
            }

            let coursesObj;
            try {
                coursesObj = JSON.parse(aiResp);
            } catch (e) {
                console.log('Error parsing JSON:', e);
                toast.error('The course response was not valid. Please try again.');
                return;
            }

            const coursesArray = Array.isArray(coursesObj)
                ? coursesObj
                : coursesObj.courses;

            if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
                toast.error("The AI didn't return any course content.");
                return;
            }

            const emailSafe = user?.email.replace(/[@.]/g, '_');
            const docId = emailSafe + '_' + Date.now().toString();
            await Promise.all(
                coursesArray.map(async (course) => {
                    await setDoc(doc(db, 'course', docId), {
                        ...course,
                        createdOn: new Date(),
                        createdBy: user?.email,
                        docId: docId,
                    });
                }),
            );

            router.replace(`/courses/my-courses/course-view/${docId}`);
            toast.success('Course created successfully!');
        } catch (e: unknown) {
            console.log('failed course', (e as Error).message);
            toast.error(
                `Failed to generate course. Please try again. ${(e as Error).message}`,
            );
        } finally {
            setGeneratingCourse(false);
        }
    };

    return {
        generateTopic,
        generatingTopic,
        topics,
        setTopics,
        onGenerateCourse,
        generatingCourse,
    };
};
