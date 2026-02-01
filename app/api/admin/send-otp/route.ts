// app/api/admin/send-otp/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function normalizePhone(input: string) {
    // Cloud API examples commonly expect digits with country code (no spaces/punctuation).
    // Many integrations break on prefixes like "00CC..." or formatting characters.
    const digits = (input || "").replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return null;
    return digits;
}

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json({ error: "Phone required" }, { status: 400 });
        }

        const to = normalizePhone(phone);
        if (!to) {
            return NextResponse.json(
                { error: "Invalid phone format. Use countrycode + number." },
                { status: 400 }
            );
        }

        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const token = process.env.WHATSAPP_SYSTEM_USER_TOKEN;

        if (!phoneNumberId || !token) {
            return NextResponse.json(
                { error: "Missing WhatsApp env vars" },
                { status: 500 }
            );
        }



        const response = await fetch(
            `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_SYSTEM_USER_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: phone,          // normalized number string
                    type: "template",
                    template: {
                        name: "hello_world",
                        language: {
                            code: "en_US"
                        }
                    }
                })
            }
        );

        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            console.log("Failed to send OTP template", data);
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to send OTP template", details: data },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            messageId: data?.messages?.[0]?.id,
        });
    } catch (err) {
        return NextResponse.json(
            { error: "Unexpected error", details: String((err as Error)?.message ?? err) },
            { status: 500 }
        );
    }
}