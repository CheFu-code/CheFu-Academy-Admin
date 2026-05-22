import { Content } from '@/types/ai';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const config = {
    responseMimeType: 'application/json',
};

const model = 'gemini-2.5-flash';

function getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    return new GoogleGenAI({ apiKey });
}

function extractJsonFromText(text: string): string {
    if (!text) return '';
    return text.replace(/^```json[\r\n]+|```$/gi, '').trim();
}

function isValidContent(contents: unknown): contents is Content[] {
    return (
        Array.isArray(contents) &&
        contents.every(
            item =>
                item &&
                typeof item === 'object' &&
                'role' in item &&
                'parts' in item &&
                Array.isArray((item as Content).parts),
        )
    );
}

export async function POST(req: Request) {
    try {
        const { contents } = await req.json();

        if (!isValidContent(contents)) {
            return NextResponse.json(
                { error: 'Invalid AI request payload' },
                { status: 400 },
            );
        }

        const ai = getAIClient();
        const response = await ai.models.generateContent({
            model,
            config,
            contents,
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const result = extractJsonFromText(text);

        if (!result) {
            return NextResponse.json(
                { error: 'No content returned from AI model' },
                { status: 502 },
            );
        }

        return NextResponse.json({ result });
    } catch (error) {
        console.error('[AI Generate API] Failed:', error);
        return NextResponse.json(
            { error: 'Failed to generate AI content' },
            { status: 500 },
        );
    }
}
