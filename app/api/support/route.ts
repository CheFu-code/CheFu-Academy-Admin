import { NextResponse } from "next/server";

export async function POST() {
    try {
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });

    }
}