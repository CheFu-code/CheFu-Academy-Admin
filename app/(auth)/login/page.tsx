'use client';
import { useAuthUser } from '@/hooks/useAuthUser';
import { UseAuth } from '@/services/authService';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
    const { loading } = useAuthUser();
    const {
        handleGoogle,
        googlePending,
        handleEmailLogin,
        email,
        setEmail,
        password,
        setPassword,
        emailPending,
    } = UseAuth();

    return (
        <LoginForm
            loading={loading}
            handleEmailLogin={handleEmailLogin}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            googlePending={googlePending}
            emailPending={emailPending}
            handleGoogle={handleGoogle}
        />
    );
}
