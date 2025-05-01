import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function GET(request,{params}) {
    try {
    
        const zodiacs = await prisma.zodiac.findMany({});

        return NextResponse.json(
            zodiacs,
            { status: 200 }
          );

    } catch (error) {
        console.error('[zodiacs_GET]', error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
          );
    }
}
