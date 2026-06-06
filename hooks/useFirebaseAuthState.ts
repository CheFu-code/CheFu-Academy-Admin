import { auth } from '@/lib/firebase';
import {
    onAuthStateChanged,
    onIdTokenChanged,
    type User,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';

export function useFirebaseAuthState() {
    const [user, setUser] = useState<User | null>(() => auth.currentUser);
    const [loading, setLoading] = useState(() => !auth.currentUser);

    useEffect(() => {
        let mounted = true;

        const syncUser = (nextUser: User | null) => {
            if (!mounted) return;
            setUser(nextUser);
            setLoading(false);
        };

        const unsubscribeAuth = onAuthStateChanged(auth, syncUser);
        const unsubscribeToken = onIdTokenChanged(auth, syncUser);

        return () => {
            mounted = false;
            unsubscribeAuth();
            unsubscribeToken();
        };
    }, []);

    const refresh = useCallback(async () => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            setUser(null);
            setLoading(false);
            return null;
        }

        await currentUser.reload();
        await currentUser.getIdToken(true);
        const refreshedUser = auth.currentUser;
        setUser(refreshedUser);
        setLoading(false);

        return refreshedUser;
    }, []);

    return { loading, refresh, user };
}
