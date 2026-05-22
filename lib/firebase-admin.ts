import admin from 'firebase-admin';

export function getFirebaseAdminApp() {
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

export function getFirebaseAdminDb() {
    return admin.firestore(getFirebaseAdminApp());
}
