'use client';

import { RecaptchaVerifier } from 'firebase/auth';
import React, { useState } from 'react';
import { toast } from 'sonner';
import PhoneLoginForm from './_components/PhoneLoginForm';

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: import('firebase/auth').ConfirmationResult;
    }
}

const PhoneLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phoneNumber.startsWith('+')) {
            toast.error(
                'Please enter phone number with country code, e.g., +27123456789',
            );
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }
            toast.success('OTP sent via WhatsApp!');
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PhoneLoginForm
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handleSubmit={handleSubmit}
            loading={loading}
        />
    );
};

export default PhoneLogin;
