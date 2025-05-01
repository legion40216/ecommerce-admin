import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { storeSchema } from '@/lib/validators';

export async function POST(request) {
    try {
        const { userId } = auth();
        if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 });
        }

        // 4. Validate request body
        const body = await request.json();
        const validatedFields = storeSchema.safeParse(body);
        if (!validatedFields.success) {
        return NextResponse.json(
            {
            error: "Validation failed",
            details: validatedFields.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
        }

        const { name } = validatedFields.data;

        const store = await prisma.store.create({
            data: {
                name: name,
                userId
            }
        });

        return NextResponse.json(
            { success: true, store },
            { status: 201 } 
          );
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}