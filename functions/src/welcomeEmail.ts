import { user } from 'firebase-functions/v1/auth';
import * as logger from 'firebase-functions/logger';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const WELCOME_EMAIL_TEMPLATE_ID = process.env.WELCOME_EMAIL_TEMPLATE_ID || '';
const WELCOME_EMAIL_FROM =
    process.env.WELCOME_EMAIL_FROM || process.env.SIGNIN_ALERT_FROM || '';
const WELCOME_EMAIL_APP_NAME = process.env.RP_NAME || 'CheFu Academy';
const WELCOME_EMAIL_APP_URL =
    process.env.WELCOME_EMAIL_APP_URL || 'https://academy.chefuinc.com';
const WELCOME_EMAIL_SUPPORT_EMAIL =
    process.env.WELCOME_EMAIL_SUPPORT_EMAIL || 'support@chefuinc.com';

const normalizeFromAddress = (raw: string): string | null => {
    const value = raw.trim();
    if (!value) return null;

    if (/\S+@\S+\.\S+/.test(value) && (value.includes('<') || !value.includes(' '))) {
        return value;
    }

    const emailMatch = value.match(/([^\s<>]+@[^\s<>]+\.[^\s<>]+)$/);
    if (!emailMatch) return null;
    const email = emailMatch[1];
    const name = value.slice(0, value.length - email.length).trim();
    if (!name) return email;
    return `${name} <${email}>`;
};

export const sendWelcomeEmailOnUserCreate = user().onCreate(async (createdUser) => {
        const toEmail = createdUser.email || '';
        const fromAddress = normalizeFromAddress(WELCOME_EMAIL_FROM);

        if (!toEmail) {
            logger.info('Skipping welcome email: user has no email', { uid: createdUser.uid });
            return;
        }

        if (!RESEND_API_KEY || !WELCOME_EMAIL_TEMPLATE_ID || !fromAddress) {
            logger.warn(
                'Skipping welcome email: missing RESEND_API_KEY, WELCOME_EMAIL_TEMPLATE_ID, or valid WELCOME_EMAIL_FROM',
            );
            return;
        }

        const userName = createdUser.displayName || toEmail.split('@')[0] || 'there';
        const nowYear = new Date().getUTCFullYear().toString();

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: fromAddress,
                to: [toEmail],
                subject: `Welcome to ${WELCOME_EMAIL_APP_NAME}`,
                template: {
                    id: WELCOME_EMAIL_TEMPLATE_ID,
                    variables: {
                        name: userName,
                        APP_NAME: WELCOME_EMAIL_APP_NAME,
                        APP_URL: WELCOME_EMAIL_APP_URL,
                        support_email: WELCOME_EMAIL_SUPPORT_EMAIL,
                        year: nowYear,
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            logger.error('Welcome email send failed', {
                uid: createdUser.uid,
                status: response.status,
                errorBody,
            });
            throw new Error(`Welcome email failed: ${response.status} ${errorBody}`);
        }

        logger.info('Welcome email sent', { uid: createdUser.uid });
    });
