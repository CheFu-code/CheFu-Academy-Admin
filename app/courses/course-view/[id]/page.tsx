'use client';

import NoCourse from '@/components/Courses/noCourse';
import CourseBanner from '@/components/Shared/CourseBanner';
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { CoursesQuery } from '@/lib/firestore/courseQueries';
import { Course } from '@/types/course';
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import { BookOpen } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const CourseView = () => {
    const router = useRouter();
    const params = useParams();
    const mainWrapperRef = useRef<HTMLDivElement>(null);

    const { user } = useAuthUser();
    const { fetchCourseById, fetchingCourseById } = CoursesQuery();
    const [course, setCourse] = useState<Course | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const id = params.id;
        if (!id || Array.isArray(id)) return;

        const fetchData = async () => {
            const courseData = await fetchCourseById(id);
            setCourse(courseData);
        };

        fetchData();
    }, [params.id, fetchCourseById]);

    const enrollCourse = async () => {
        if (!course || !user) return;

        const rootCourseId = course.originalCourseId ?? course.id;

        if (course.createdBy === user.email) {
            toast.error("You can't enroll in your own course.");
            return;
        }

        try {
            setEnrolling(true);
            const emailSafe = user.email.replace(/[@.]/g, '_');

            // check if a copy already exists for this user
            const q = query(
                collection(db, 'course'),
                where('createdBy', '==', user.email),
                where('originalCourseId', '==', rootCourseId),
            );
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
                toast.error('You are already enrolled in this course!');
                const existingDocId = querySnap.docs[0].id;
                router.replace(
                    `/courses/my-courses/course-view/${existingDocId}`,
                );
                return;
            }

            // create new copy
            const docId = emailSafe + '_' + Date.now().toString();
            const data = {
                ...course,
                originalCourseId: rootCourseId,
                createdBy: user.email,
                createdOn: new Date(),
                enrolled: true,
                completedChapter: [],
            };

            await setDoc(doc(db, 'course', docId), data);
            toast.success('Course enrolled successfully!');
            router.replace(`/courses/my-courses/course-view/${docId}`);
        } catch (error) {
            console.error('Failed to enroll course:', error);
            toast.error('Failed to enroll. Please try again.');
        } finally {
            setEnrolling(false);
        }
    };

    const handleClick = () => {
        if (!course) return;
        if (course?.createdBy === user?.email) {
            router.push(`/courses/my-courses/course-view/${course?.id}`);
            return;
        } else {
            toast.error('Please enroll in the course first.');
            if (mainWrapperRef.current) {
                mainWrapperRef.current.scrollTo({
                    top: mainWrapperRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
            return;
        }
    };

    if (fetchingCourseById) {
        return <CourseCardSkeleton />;
    }
    if (!course) {
        return <NoCourse />;
    }

    return (
        <div
            ref={mainWrapperRef}
            className="p-4 max-w-5xl mx-auto space-y-6 h-screen overflow-y-auto"
        >
            {/* Course Banner */}
            {course.banner_image && (
                <CourseBanner
                    banner_image={course.banner_image}
                    courseTitle={course.courseTitle}
                    category={course.category}
                />
            )}

            {/* Course Title & Description */}
            <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {course.courseTitle}
                </h1>
                <div className="text-sm text-muted-foreground flex-row items-center flex gap-2">
                    <BookOpen size={17} />
                    <p>{course.chapters.length} chapters</p>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                    {course.description}
                </p>
            </div>

            {/* Chapters List inside ScrollArea */}
            <ScrollArea className="h-100">
                {' '}
                {/* set a fixed height for scrolling */}
                <div className="space-y-3">
                    <h2 className="text-xl font-semibold">Chapters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {course.chapters.map((chapter, idx) => (
                            <Card
                                onClick={handleClick}
                                key={idx}
                                className="p-3 cursor-pointer hover:bg-muted/50 transition"
                            >
                                <CardTitle className="text-sm sm:text-base">
                                    {chapter.chapterName}
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground line-clamp-3">
                                    {chapter.content[0]?.explain as string}
                                </CardDescription>
                            </Card>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            {/* Enroll button outside ScrollArea */}
            {course?.createdBy !== user?.email && (
                <Button
                    disabled={enrolling}
                    onClick={enrollCourse}
                    className="w-full cursor-pointer"
                >
                    {enrolling ? 'Enrolling...' : 'Enroll'}
                </Button>
            )}
        </div>
    );
};

export default CourseView;
