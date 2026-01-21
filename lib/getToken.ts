import { auth } from './firebase';

async function getUserToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
}

export default getUserToken;
