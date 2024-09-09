import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { userId } = auth(); // Correctly call the auth function
        const body = await request.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const store = await prisma.store.create({
            data: {
                name: body.name,
                userId
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}