import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(request,{params}) {
    try {

        const { userId } = auth(); 
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const body = await request.json();
        const { name, value } = body;

        if (!name || !value) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.sizeId) {
            return new NextResponse("size is required", { status: 400 });
        }

        const { sizeId } = params;

        const size = await prisma.size.updateMany({
            where: {
                id: sizeId,
            },
            
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.error('[size_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { userId } = auth(); // Correctly call the auth function

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.sizeId) {
            return new NextResponse("size is required", { status: 400 });
        }

        const { sizeId } = params;

        const size = await prisma.size.delete({
            where: {
                id: sizeId,
            },
        });

        return NextResponse.json(size);

    } catch (error) {
        console.error('[size_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        if(!params.sizeId) {
            return new NextResponse("size is required", { status: 400 });
        }

        const { sizeId } = params;

        const size = await prisma.size.findUnique({
            where: {
                id: sizeId
            },
        });

        return NextResponse.json(size);
    } catch (error) {
         console.error('[size_GET]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

