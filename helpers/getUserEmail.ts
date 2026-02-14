import { FacebookAuthProvider, signInWithPopup } from 'firebase/auth';

async function fetchEmailFromFacebookGraph(
    result: Awaited<ReturnType<typeof signInWithPopup>>,
) {
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const fbAccessToken = credential?.accessToken;
    if (!fbAccessToken) return null;

    try {
        const resp = await fetch(
            `https://graph.facebook.com/me?fields=email&access_token=${fbAccessToken}`,
        );
        const data = await resp.json();
        if (data?.email && typeof data.email === 'string') {
            return data.email;
        }
    } catch {
        // Ignore and fall back
    }
    return null;
}
export { fetchEmailFromFacebookGraph };