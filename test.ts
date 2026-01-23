import CheFuAcademy from 'chefu-academy-sdk';

async function testSDK() {
    const email = '';
    const password = '';
    const sdk = new CheFuAcademy({
        apiKey: '',
    });

    const res = await sdk.auth.login(email, password);
    console.log('course data', res.data());
}

testSDK();
