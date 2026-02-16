import { user } from 'firebase-functions/v1/auth';
import * as logger from 'firebase-functions/logger';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { normalizeFromAddress } from './emailUtils';

if (getApps().length === 0) {
    initializeApp();
}
const db = getFirestore();
const WELCOME_EMAIL_STATUS = db.collection('emailDeliveryStatus');

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const WELCOME_EMAIL_TEMPLATE_ID = process.env.WELCOME_EMAIL_TEMPLATE_ID || '';
const WELCOME_EMAIL_FROM =
    process.env.WELCOME_EMAIL_FROM || process.env.SIGNIN_ALERT_FROM || '';
const WELCOME_EMAIL_APP_NAME = process.env.RP_NAME || 'CheFu Academy';
const WELCOME_EMAIL_APP_URL =
    process.env.WELCOME_EMAIL_APP_URL || 'https://academy.chefuinc.com';
const WELCOME_EMAIL_SUPPORT_EMAIL =
    process.env.WELCOME_EMAIL_SUPPORT_EMAIL || 'support@chefuinc.com';

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

        const statusRef = WELCOME_EMAIL_STATUS.doc(createdUser.uid);
        const statusSnap = await statusRef.get();
        const welcomeEmailSent = statusSnap.data()?.welcomeEmailSent === true;
        if (welcomeEmailSent) {
            logger.info('Skipping welcome email: already sent', { uid: createdUser.uid });
            return;
        }

        const userName = createdUser.displayName || toEmail.split('@')[0] || 'there';
        const nowYear = new Date().getUTCFullYear().toString();
        try {
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
                return;
            }

            await statusRef.set(
                {
                    welcomeEmailSent: true,
                    welcomeEmailSentAt: new Date().toISOString(),
                    email: toEmail,
                },
                { merge: true },
            );
            logger.info('Welcome email sent', { uid: createdUser.uid });
        } catch (error: unknown) {
            logger.error('Welcome email send failed with unexpected error', {
                uid: createdUser.uid,
                error,
            });
            return;
        }
    });
