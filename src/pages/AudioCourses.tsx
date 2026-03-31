import { useCallback, useEffect, useState } from 'react';
import { BookOpen, BookPlus, FileQuestion, LanguagesIcon, Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { serverURL } from '@/constants';
import Ads from '@/components/Ads';

const AudioCourses = () => {
    const [loading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [audioCourses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const userId = sessionStorage.getItem('uid');
    const [modules, setTotalModules] = useState({});

    const fetchUserCourses = useCallback(async () => {
        setIsLoading(page === 1);
        setLoadingMore(page > 1);
        const postURL = `${serverURL}/api/coursesaudio?userId=${userId}&page=${page}&limit=9`;
        try {
            const response = await axios.get(postURL);
            if (response.data.length === 0) {
                setHasMore(false);
            } else {
                const modulesMap = { ...modules }; // Spread existing state
                for (const course of response.data) {
                    const totalModules = await CountTotalTopics(course.content, course.mainTopic, course._id);
                    modulesMap[course._id] = totalModules;
                }
                setTotalModules(modulesMap);
                await setCourses((prevCourses) => [...prevCourses, ...response.data]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }, [userId, page]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchUserCourses();
    }, [fetchUserCourses]);

    const handleScroll = useCallback(() => {
        if (!hasMore || loadingMore) return;
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore, loadingMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const CountTotalTopics = async (json: string, mainTopic: string, courseId: string) => {
        try {
            const jsonData = JSON.parse(json);
            let totalTopics = 0;
            jsonData[mainTopic.toLowerCase()].forEach((topic: { subtopics: string[]; }) => {
                topic.subtopics.forEach((subtopic) => {
                    totalTopics++;
                });
            });
            return totalTopics;
        } catch (error) {
            console.error(error);
            return 0;
        }
    }

    async function redirectCourse(content: string, mainTopic: string, type: string, courseId: string, completed: string, end: string, photo: string) {
        const postURL = serverURL + '/api/getmyresult';
        const response = await axios.post(postURL, { courseId });
        if (response.data.success) {
            const jsonData = JSON.parse(content);
            sessionStorage.setItem('courseId', courseId);
            sessionStorage.setItem('first', completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            let ending = '';
            if (completed) ending = end;
            navigate('/dashboard/audio-courses/' + courseId, {
                state: {
                    jsonData,
                    mainTopic: mainTopic.toUpperCase(),
                    type: type.toLowerCase(),
                    courseId,
                    end: ending,
                    pass: response.data.message,
                    lang: response.data.lang,
                    photo: photo
                }
            });
        } else {
            const jsonData = JSON.parse(content);
            sessionStorage.setItem('courseId', courseId);
            sessionStorage.setItem('first', completed);
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            let ending = '';
            if (completed) ending = end;
            navigate('/dashboard/audio-courses/' + courseId, {
                state: {
                    jsonData,
                    mainTopic: mainTopic.toUpperCase(),
                    type: type.toLowerCase(),
                    courseId,
                    end: ending,
                    pass: false,
                    lang: response.data.lang,
                    photo: photo
                }
            });
        }
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold tracking-tight text-gradient bg-gradient-to-r from-primary to-indigo-500 mb-8">
                Audio Courses
            </h1>

            <div className="space-y-4">
                {loading
                    ? // Skeleton placeholders
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-32 h-20 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <Skeleton className="w-10 h-10 rounded-full" />
                            </div>
                        </Card>
                    ))
                    : // Actual content
                    <>
                        {audioCourses.length > 0 ? audioCourses.map((course) => (
                            <Card key={course.id} className="p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={course.photo}
                                        alt={course.mainTopic}
                                        className="w-32 h-20 object-cover rounded-lg"
                                    />

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-1 capitalize">{course.mainTopic}</h3>
                                        <p className="text-sm text-muted-foreground flex-row flex items-center"> <BookOpen size={14} className="mr-1" /> {modules[course._id] || 0} modules </p>
                                    </div>

                                    <Button onClick={() => redirectCourse(course.content, course.mainTopic, course.type, course._id, course.completed, course.end, course.photo)} size="icon" className="rounded-full bg-primary hover:bg-primary/90">
                                        <Play className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Card>
                        ))
                            :
                            (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="bg-muted/50 rounded-full p-8 mb-6">
                                        <FileQuestion className="h-16 w-16 text-muted-foreground/60" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">No Courses Created Yet</h2>
                                    <p className="text-muted-foreground max-w-md mb-6">
                                        You haven't created any courses yet. Generate your first AI-powered course to start learning.
                                    </p>
                                    <Button size="lg" className="shadow-lg" asChild>
                                        <Link to="/dashboard/generate-course">
                                            <BookPlus className="mr-2 h-5 w-5" />
                                            Create Your First Course
                                        </Link>
                                    </Button>
                                </div>
                            )}
                    </>
                }

                {loadingMore &&
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-32 h-20 rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                                <Skeleton className="w-10 h-10 rounded-full" />
                            </div>
                        </Card>
                    ))}
            </div>
            <Ads />
        </div>
    );
};

export default AudioCourses;
