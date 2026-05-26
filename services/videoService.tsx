import { auth, db } from '@/lib/firebase';
import { Video } from '@/types/video';
import {
    collection,
    doc,
    DocumentData,
    DocumentSnapshot,
    getDoc,
    getDocs,
    orderBy,
    query,
    QueryDocumentSnapshot,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const youtubeWatchUrl = (videoId: string) =>
    `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

const youtubeEmbedUrl = (videoId: string) =>
    `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;

type VideoSnapshot =
    | QueryDocumentSnapshot<DocumentData>
    | DocumentSnapshot<DocumentData>;

const toUploadedVideo = (docSnap: VideoSnapshot): Video => {
    const data = docSnap.data() || {};

    return {
        id: docSnap.id,
        source: 'uploaded',
        title: data.title || 'Untitled video',
        instructorCompany: data.instructorCompany || '',
        instructorName: data.instructorName || '',
        description: data.description || '',
        videoURL: data.videoURL || data.url || '',
        thumbnailURL: data.thumbnailURL || data.thumbnail || '',
        uploadedBy: data.uploadedBy || '',
        uploadedAt: data.uploadedAt || null,
        category: data.category || 'Tech & Coding',
        visibility: data.visibility || 'public',
        level: data.level || '',
        duration: Number(data.duration || 0),
        views: Number(data.views || 0),
        topics: Array.isArray(data.topics) ? data.topics : [],
    };
};

const toYouTubeVideo = (docSnap: VideoSnapshot): Video => {
    const data = docSnap.data() || {};
    const youtubeVideoId = String(data.videoId || '').trim();

    return {
        id: docSnap.id,
        source: 'youtube',
        videoId: youtubeVideoId,
        youtubeVideoId,
        title: data.title || 'Untitled YouTube video',
        instructorCompany: data.instructorCompany || 'YouTube',
        instructorName: data.instructorName || data.channelTitle || 'YouTube',
        description:
            data.description ||
            'A curated YouTube lesson selected for CheFu Academy learners.',
        videoURL: youtubeVideoId ? youtubeWatchUrl(youtubeVideoId) : '',
        embedURL: youtubeVideoId ? youtubeEmbedUrl(youtubeVideoId) : undefined,
        thumbnailURL: data.thumbnailURL || data.thumbnail || '',
        uploadedBy: data.uploadedBy || data.channelTitle || 'YouTube',
        uploadedAt: data.uploadedAt || data.createdAt || null,
        category: data.category || 'Tech & Coding',
        visibility: data.visibility || 'public',
        level: data.level || 'beginner',
        duration: Number(data.duration || 0),
        views: Number(data.views || 0),
        topics: Array.isArray(data.topics) ? data.topics : [],
    };
};

export const uploadVideo = async (
    title: string,
    instructorCompany: string,
    instructorName: string,
    description: string,
    videoUri: string,
    thumbnailUri: string,
    category: string,
    visibility: 'public' | 'private',
    level: 'beginner' | 'advance',
    duration: number,
    views: number = 0,
    topics: string[],
) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const videoId = uuidv4().toString();

    // Upload video and thumbnail
    const videoURL = await uploadFile(videoUri, `videos/${videoId}/video.mp4`);
    const thumbnailURL = await uploadFile(
        thumbnailUri,
        `videos/${videoId}/thumbnail.jpg`,
    );

    // Save Firestore metadata
    await setDoc(doc(db, 'videos', videoId), {
        id: videoId,
        title,
        instructorCompany,
        instructorName,
        description,
        videoURL,
        thumbnailURL,
        category,
        uploadedBy: user.email,
        uploadedAt: serverTimestamp(),
        visibility,
        duration,
        level,
        views,
        topics,
    });

    return true;
};

export const uploadFile = async (
    fileOrUri: File | string,
    path: string,
): Promise<string> => {
    const storage = getStorage();
    const fileRef = ref(storage, path);

    let data: Blob;

    if (typeof fileOrUri === 'string') {
        // It's a URI → fetch blob
        const response = await fetch(fileOrUri);
        data = await response.blob();
    } else {
        // It's already a File
        data = fileOrUri;
    }

    await uploadBytes(fileRef, data);
    return await getDownloadURL(fileRef);
};

export const fetchUploadedVideos = async (): Promise<Video[]> => {
    const q = query(
        collection(db, 'videos'),
        where('visibility', '==', 'public'),
        orderBy('uploadedAt', 'desc'),
    );

    const snap = await getDocs(q);
    return snap.docs.map(toUploadedVideo);
};
export const fetchYTVideos = async (): Promise<Video[]> => {
    const q = query(
        collection(db, 'youTubeVideos'),
        orderBy('createdAt', 'desc'),
    );

    const snap = await getDocs(q);
    return snap.docs.map(toYouTubeVideo);
};

export const fetchAllPublicVideos = async (): Promise<Video[]> => {
    const [uploadedVideos, youtubeVideos] = await Promise.all([
        fetchUploadedVideos(),
        fetchYTVideos(),
    ]);

    return [...uploadedVideos, ...youtubeVideos];
};

export const fetchVideoById = async (
    videoId: string,
): Promise<Video | null> => {
    try {
        const uploadedVideoRef = doc(db, 'videos', videoId);
        const uploadedVideoSnap = await getDoc(uploadedVideoRef);

        if (uploadedVideoSnap.exists()) {
            return toUploadedVideo(uploadedVideoSnap);
        }

        const youtubeVideoRef = doc(db, 'youTubeVideos', videoId);
        const youtubeVideoSnap = await getDoc(youtubeVideoRef);

        if (youtubeVideoSnap.exists()) {
            return toYouTubeVideo(youtubeVideoSnap);
        }

        return null;
    } catch (error) {
        console.error('Error fetching video:', error);
        return null;
    }
};
