// services/enable-totp-mfa.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
// Import JSON as module (works when "type":"module" in package.json and Node >= 18)

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

initializeApp({
    credential: cert(serviceAccount),
    projectId: 'cheforumreal',
});

async function main() {
    await getAuth()
        .projectConfigManager()
        .updateProjectConfig({
            multiFactorConfig: {
                state: 'ENABLED',
                providerConfigs: [
                    {
                        state: 'ENABLED',
                        totpProviderConfig: { adjacentIntervals: 5 },
                    },
                ],
            },
        });
    console.log('TOTP MFA enabled for project.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
