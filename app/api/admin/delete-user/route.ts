//app/api/admin/delete-user/route.ts

import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

function getFirebaseAdminApp() {
    if (admin.apps.length) {
        return admin.app();
    }

    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (!serviceAccountJson) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT is not configured');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
}

export async function POST(req: Request) {
    try {
        const { uid, email } = await req.json();

        if (!uid) {
            return NextResponse.json({ error: 'UID required' }, { status: 400 });
        }
        if (!email) {
            return NextResponse.json({ error: 'Email required' }, { status: 400 });
        }

        const adminApp = getFirebaseAdminApp();

        // 1️⃣ Delete Auth user
        await admin.auth(adminApp).deleteUser(uid);

        // 2️⃣ Delete Firestore doc
        await admin.firestore(adminApp).collection('users').doc(email).delete();

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error(error);
        const errorMessage =
            error instanceof Error
                ? error.message
                : 'Failed to delete user';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
