import { auth } from '@/lib/firebase';
import { clearSessionCookie } from '@/lib/clientSession';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export const useSignOut = () => {
    const [loggingOut, setLoggingOut] = useState(false);
    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            const results = await Promise.allSettled([
                clearSessionCookie(),
                signOut(auth),
            ]);
            const rejected = results.find(result => result.status === 'rejected');

            if (rejected) {
                throw rejected.reason;
            }
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoggingOut(false);
        }
    };
    return { handleLogout, loggingOut};
};
