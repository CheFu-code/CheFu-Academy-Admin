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
        if (generatingTopic) return; // Prevent double submission
        if (!userInput.trim()) {
            toast.error('Please enter a course idea first.');
            return;
        }

        setGeneratingTopic(true);

        let topicIdea = [];
        try {
            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) {
                alert('AI key is missing');
                setGeneratingTopic(false);
                return;
            }
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
                alert('The AI didn’t return any results.');
                topicIdea = [];
                setGeneratingTopic(false);
                return;
            } else {
                function safeJsonParse(json: string) {
                    try {
                        return JSON.parse(json);
                    } catch {
                        return null;
                    }
                }

                try {
                    topicIdea = safeJsonParse(cleanedResponse) || [];
                } catch (e) {
                    topicIdea = [];
                    console.log('Error parsing JSON:', e);
                }
            }
            setUserInput('');
            console.log('Generated Topics:', topicIdea);
        } catch (error) {
            console.error('Error generating topic:', error);
            alert(`Failed to generate topic. Please try again., \n ${error}`);
            topicIdea = [];
        } finally {
            setTopics(Array.isArray(topicIdea) ? topicIdea : []);
            setGeneratingTopic(false);
        }
    };

    const onGenerateCourse = async (selectedTopics: string[]) => {
        if (generatingCourse) return;
        if (!selectedTopics.length) {
            alert('Please select at least one topic.');
            return;
        }
        setGeneratingCourse(true);
        const initialToastId = toast.success('Generating course, please wait...', {
            duration: Infinity,
        });

        // Show a follow-up toast if generating takes more than 10 seconds
        const followUpTimeout = setTimeout(() => {
            toast('Hang on, your course is almost ready!', {
                duration: 3000,
            });
        }, 20000); // 10 seconds delay
        const promptText = selectedTopics.join(', ') + Prompt.COURSE;
        const contents = [
            {
                role: 'user',
                parts: [{ text: promptText }],
            },
        ];
        try {
            const aiResp = await generateCourse(contents);

            clearTimeout(followUpTimeout); // stop the follow-up if done early
            toast.dismiss(initialToastId);

            if (!aiResp || aiResp.trim() === '') {
                alert('The AI didn’t return any results.');
                setGeneratingCourse(false);
                return;
            }
            let coursesObj;
            try {
                coursesObj = JSON.parse(aiResp);
            } catch (e) {
                console.log('Error parsing JSON:', e);
                return;
            }
            const coursesArray = Array.isArray(coursesObj)
                ? coursesObj
                : coursesObj.courses;

            if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
                alert('The AI didn’t return any results.');
                setGeneratingCourse(false);
                return;
            }

            // Await all course writes before continuing
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
            alert(
                `Failed to generate course. Please try again., \n ${(e as Error).message}`,
            );
        } finally {
            setGeneratingCourse(false);
            clearTimeout(followUpTimeout);
            toast.dismiss(initialToastId);
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
