const CheFuAcademy = require('chefu-academy-sdk');

async function test() {
    const sdk = CheFuAcademy({
        apiKey: '',
    });

    const res = await sdk.courses.getById('kurisanim2_gmail_com_1763294042800');
    console.log(res);
}
