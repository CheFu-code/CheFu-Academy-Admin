//app/api/admin/delete-user/route.ts

import admin from 'firebase-admin';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

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
