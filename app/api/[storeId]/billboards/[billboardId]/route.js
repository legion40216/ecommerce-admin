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
        const { label, imageUrl } = body;

        if (!label || !imageUrl) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard is required", { status: 400 });
        }

        const { billboardId } = params;

        const billboard = await prisma.billboard.updateMany({
            where: {
                id: billboardId,
            },
            
            data: {
               label,
               imageUrl
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.error('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { userId } = auth(); // Correctly call the auth function

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard is required", { status: 400 });
        }

        const { billboardId } = params;

        const billboard = await prisma.billboard.delete({
            where: {
                id: billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
            console.error('[BILLBOARD_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        if(!params.billboardId) {
            return new NextResponse("billboard is required", { status: 400 });
        }

        const { billboardId } = params;

        const billboard = await prisma.billboard.findUnique({
            where: {
                id: billboardId
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
         console.error('[BILLBOARD_GET]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}