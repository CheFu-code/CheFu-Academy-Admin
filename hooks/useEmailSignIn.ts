import { getFriendlyAuthMessage } from '@/helpers/authErrors';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export const useEmailSignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailPending, startEmailTransition] = useTransition();

    const handleEmailLogin = async () => {
        startEmailTransition(async () => {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success('Login successful!');
            } catch (error) {
                const message = getFriendlyAuthMessage(error);
                toast.error(message);
            }
        });
    };
    return {
        handleEmailLogin,
        email,
        setEmail,
        password,
        setPassword,
        emailPending,
    };
};
