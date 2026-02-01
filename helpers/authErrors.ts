// errors/authErrors.ts
import { FirebaseError } from 'firebase/app';

export function getFriendlyAuthMessage(error: unknown): string {
    // Default fallback
    const fallback = 'Something went wrong while signing you in. Please try again.';

    if (!(error instanceof FirebaseError)) return fallback;

    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/missing-password':
            return 'Please enter your password.';
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
            return 'The email or password you entered is incorrect.';
        case 'auth/user-not-found':
            return 'No account exists with that email.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please wait a bit and try again.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection and try again.';
        case 'auth/operation-not-allowed':
            return 'Email/password sign-in is not enabled for this project.';
        case 'auth/invalid-api-key':
            return 'Configuration error: invalid API key.';
        case 'auth/app-not-authorized':
            return 'This app is not authorized to use Firebase Authentication.';
        default:
            // Optionally include the original message in dev only
            return fallback;
    }
}
