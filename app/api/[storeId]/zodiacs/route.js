import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request,{params}) {
    try {
    
        const zodiacs = await prisma.zodiac.findMany({});

        return NextResponse.json(zodiacs);

    } catch (error) {
        console.error('[zodiacs_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
