import { BACKEND_URL, WEBSITE_URL } from '@/constants/Data';

export const dynamic = 'force-static';

export function GET() {
    return Response.json(
        {
            issuer: WEBSITE_URL,
            authorization_endpoint: `${WEBSITE_URL}/login`,
            token_endpoint: `${BACKEND_URL}/auth/session`,
            jwks_uri:
                'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
            response_types_supported: ['code', 'id_token', 'token'],
            grant_types_supported: [
                'authorization_code',
                'refresh_token',
                'urn:ietf:params:oauth:grant-type:token-exchange',
            ],
            subject_types_supported: ['public'],
            id_token_signing_alg_values_supported: ['RS256'],
            scopes_supported: [
                'openid',
                'email',
                'profile',
                'courses:read',
                'courses:write',
                'videos:read',
                'ai:generate',
            ],
            claims_supported: ['sub', 'email', 'email_verified', 'name'],
        },
        {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            },
        },
    );
}
