import { createHash } from 'node:crypto';
import * as logger from 'firebase-functions/logger';
import {
    PASSKEY_ADDED_FROM,
    PASSKEY_ADDED_SECURITY_URL,
    PASSKEY_ADDED_SUPPORT_EMAIL,
    PASSKEY_ADDED_TEMPLATE_ID,
    RESEND_API_KEY,
    RP_NAME,
    SIGNIN_ALERT_FROM,
    SIGNIN_ALERT_PASSWORD_CHANGE_URL,
    SIGNIN_ALERT_TEMPLATE_ID,
    auth,
} from './config';
import { areSecurityEmailsEnabled, normalizeActionUrl } from './helpers';
import { normalizeFromAddress } from '../emailUtils';

export const sendSignInAlertEmail = async (
    uid: string,
    details: {
        origin: string;
        credentialId: string;
        ipAddress: string;
        userAgent: string;
    },
) => {
    const fromAddress = normalizeFromAddress(SIGNIN_ALERT_FROM);
    if (!fromAddress || !RESEND_API_KEY || !SIGNIN_ALERT_TEMPLATE_ID) {
        logger.warn(
            'SIGNIN_ALERT_FROM is invalid (or missing), RESEND_API_KEY is missing, or SIGNIN_ALERT_TEMPLATE_ID is missing',
        );
        return;
    }

    const user = await auth.getUser(uid);
    if (!user.email) {
        logger.warn('Skipping sign-in alert email because user has no email', { uid });
        return;
    }

    const securityEmailsEnabled = await areSecurityEmailsEnabled(user.email);
    if (!securityEmailsEnabled) {
        const emailHash = createHash('sha256').update(user.email).digest('hex');
        logger.info('Skipping sign-in alert email because security emails are disabled', {
            uid,
            emailHash,
        });
        return;
    }

    const signedInAt = new Date().toISOString();
    const passwordChangeUrl =
        normalizeActionUrl(SIGNIN_ALERT_PASSWORD_CHANGE_URL) ||
        'https://academy.chefuinc.com/settings/account';

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: fromAddress,
            to: [user.email],
            subject: `Sign-in alert for ${RP_NAME}`,
            template: {
                id: SIGNIN_ALERT_TEMPLATE_ID,
                variables: {
                    USER_NAME: user.displayName || user.email,
                    SIGNED_IN_AT: signedInAt,
                    IP_ADDRESS: details.ipAddress,
                    ORIGIN: details.origin,
                    USER_AGENT: details.userAgent,
                    CREDENTIAL_ID: details.credentialId,
                    PASSWORD_CHANGE_URL: passwordChangeUrl,
                    APP_NAME: RP_NAME,
                },
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Resend request failed: ${response.status} ${errorBody}`);
    }
};

export const sendPasskeyAddedEmail = async (
    uid: string,
    details: {
        origin: string;
        ipAddress: string;
        userAgent: string;
        addedAt: string;
    },
) => {
    const fromAddress = normalizeFromAddress(PASSKEY_ADDED_FROM);
    if (!fromAddress || !RESEND_API_KEY || !PASSKEY_ADDED_TEMPLATE_ID) {
        logger.warn(
            'PASSKEY_ADDED_FROM is invalid (or missing), RESEND_API_KEY is missing, or PASSKEY_ADDED_TEMPLATE_ID is missing',
        );
        return;
    }

    const user = await auth.getUser(uid);
    if (!user.email) {
        logger.warn('Skipping passkey-added email because user has no email', { uid });
        return;
    }

    const securityEmailsEnabled = await areSecurityEmailsEnabled(user.email);
    if (!securityEmailsEnabled) {
        const emailHash = createHash('sha256').update(user.email).digest('hex');
        logger.info('Skipping passkey-added email because security emails are disabled', {
            uid,
            emailHash,
        });
        return;
    }

    const securityUrl =
        normalizeActionUrl(PASSKEY_ADDED_SECURITY_URL) ||
        'https://academy.chefuinc.com/settings/account';
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: fromAddress,
            to: [user.email],
            subject: `New passkey added for ${RP_NAME}`,
            template: {
                id: PASSKEY_ADDED_TEMPLATE_ID,
                variables: {
                    USER_NAME: user.displayName || user.email,
                    DEVICE: details.userAgent,
                    ADDED_AT: details.addedAt,
                    ORIGIN: details.origin,
                    IP_ADDRESS: details.ipAddress,
                    SECURITY_URL: securityUrl,
                    SUPPORT_EMAIL: PASSKEY_ADDED_SUPPORT_EMAIL,
                    APP_NAME: RP_NAME,
                    YEAR: new Date().getUTCFullYear().toString(),
                },
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Passkey-added email failed: ${response.status} ${errorBody}`);
    }
};

