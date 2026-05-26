import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { Video } from '@/types/video';

const youtubeWatchUrl = (videoId: string) =>
    `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

const youtubeEmbedUrl = (videoId: string) =>
    `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;

function toUploadedVideo(id: string, data: FirebaseFirestore.DocumentData): Video {
    return {
        id,
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
}

function toYouTubeVideo(id: string, data: FirebaseFirestore.DocumentData): Video {
    const youtubeVideoId = String(data.videoId || '').trim();

    return {
        id,
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
}

export async function fetchPublicVideosServer(): Promise<Video[]> {
    const snapshot = await getFirebaseAdminDb()
        .collection('videos')
        .where('visibility', '==', 'public')
        .orderBy('uploadedAt', 'desc')
        .get();

    return snapshot.docs.map(doc => toUploadedVideo(doc.id, doc.data()));
}

export async function fetchYouTubeVideosServer(): Promise<Video[]> {
    const snapshot = await getFirebaseAdminDb()
        .collection('youTubeVideos')
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => toYouTubeVideo(doc.id, doc.data()));
}
