'use client';

import NoCourse from '@/components/Courses/noCourse';
import Loading from '@/components/Shared/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthUser } from '@/hooks/useAuthUser';
import { db } from '@/lib/firebase';
import { CoursesQuery } from '@/lib/firestore/courseQueries';
import { Course } from '@/types/course';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const CourseView = () => {
    const { user } = useAuthUser();
    const router = useRouter();
    const params = useParams();
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
        if (!course) return;
        if (course.enrolled) {
            toast.error('You are already enrolled in this course.');
            return;
        }
        if (!user) {
            toast.error('Please login to enroll in this course.');
            return;
        }

        try {
            setEnrolling(true);

            const emailSafe = user.email.replace(/[@.]/g, '_');

            // check if a copy already exists for this user
            const q = query(
                collection(db, 'course'),
                where('originalCourseId', '==', course.id),
                where('createdBy', '==', user.email),
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
                originalCourseId: course.id,
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

    if (fetchingCourseById) {
        return <Loading message="Loading..." />;
    }
    if (!course) {
        return <NoCourse />;
    }

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            {/* Course Banner */}
            {course.banner_image && (
                <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
                    <Image
                        fill
                        priority
                        src={course.banner_image}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover"
                    />
                    {course.category && (
                        <Badge className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1">
                            {course.category}
                        </Badge>
                    )}
                </div>
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
