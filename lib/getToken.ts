import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

async function getUserToken() {
    return new Promise<string | null>((resolve) => {
        const user = auth.currentUser;
        if (user) {
            user.getIdToken()
                .then(resolve)
                .catch((err) => {
                    console.error('Error getting token:', err);
                    resolve(null);
                });
        } else {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe(); // stop listening once fired
                if (user) {
                    try {
                        const token = await user.getIdToken();
                        resolve(token);
                    } catch (err) {
                        console.error('Error getting token:', err);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            });
        }
    });
}

export default getUserToken;
