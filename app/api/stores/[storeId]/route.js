import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(request,{params}) {
    try {
        const { userId } = auth(); 
        
        const body = await request.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { storeId } = params;

        const store = await prisma.store.updateMany({
            where: {
                id: storeId,
            },
            
            data: {
               name: body.name
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { userId } = auth(); // Correctly call the auth function


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { storeId } = params;

        const store = await prisma.store.deleteMany({
            where: {
                id: storeId,
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}