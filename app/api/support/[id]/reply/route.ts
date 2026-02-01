// app/api/support/[id]/reply/route.ts
import { NextResponse } from 'next/server';

type RouteContext = { params: { id: string } };

export async function POST(req: Request, { params }: RouteContext) {
    try {
        const { id } = params;
        const body = await req.json();
        const { message } = body as { message: string };

        if (!message || !message.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const authHeader = req.headers.get('authorization') ?? '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // TODO: persist reply, update ticket updatedAt/status
        // await db.ticketMessage.create({ data: { ticketId: id, from: 'support', text: message } });
        // await db.ticket.update({ where: { id }, data: { status: 'pending', updatedAt: new Date() } });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}