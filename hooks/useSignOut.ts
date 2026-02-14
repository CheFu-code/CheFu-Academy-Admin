import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

export const useSignOut = () => {
    const [loggingOut, setLoggingOut] = useState(false);
    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await signOut(auth);
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setLoggingOut(false);
        }
    };
    return { handleLogout, loggingOut};
};
