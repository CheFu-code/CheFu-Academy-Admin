import { getFirebaseAdminDb } from '@/lib/firebase-admin';
import { Video } from '@/types/video';

function toVideo(id: string, data: FirebaseFirestore.DocumentData): Video {
    return {
        id,
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

export async function fetchPublicVideosServer(): Promise<Video[]> {
    const snapshot = await getFirebaseAdminDb()
        .collection('videos')
        .where('visibility', '==', 'public')
        .orderBy('uploadedAt', 'desc')
        .get();

    return snapshot.docs.map(doc => toVideo(doc.id, doc.data()));
}

export async function fetchYouTubeVideosServer(): Promise<Video[]> {
    const snapshot = await getFirebaseAdminDb()
        .collection('youTubeVideos')
        .orderBy('createdAt', 'desc')
        .get();

    return snapshot.docs.map(doc => toVideo(doc.id, doc.data()));
}
