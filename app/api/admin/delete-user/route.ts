//app/api/admin/delete-user/route.ts

import admin from 'firebase-admin';
import { NextResponse } from 'next/server';

// 🔐 Initialize Admin SDK safely
if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin Initialized');
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

        // 1️⃣ Delete Auth user
        await admin.auth().deleteUser(uid);

        // 2️⃣ Delete Firestore doc
        await admin.firestore().collection('users').doc(email).delete();

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
