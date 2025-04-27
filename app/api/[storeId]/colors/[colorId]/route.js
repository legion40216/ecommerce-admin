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

        if(!params.colorId) {
            return new NextResponse("color is required", { status: 400 });
        }

        const { colorId } = params;

        const color = await prisma.color.updateMany({
            where: {
                id: colorId,
            },
            
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error('[color_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { userId } = auth(); // Correctly call the auth function

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.colorId) {
            return new NextResponse("color is required", { status: 400 });
        }

        const { colorId } = params;

        const color = await prisma.color.delete({
            where: {
                id: colorId,
            },
        });

        return NextResponse.json(color);
    } catch (error) {
        console.error('[color_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        if(!params.colorId) {
            return new NextResponse("color is required", { status: 400 });
        }

        const { colorId } = params;

        const color = await prisma.color.findUnique({
            where: {
                id: colorId
            },
        });

        return NextResponse.json(color);
    } catch (error) {
         console.error('[color_GET]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

