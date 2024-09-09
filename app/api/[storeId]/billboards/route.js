import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request,{params}) {
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

        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const billboard = await prisma.billboard.create({
            data: {
               label,
               imageUrl,
               storeId,
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.error('[BILLBOARD_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const billboards = await prisma.billboard.findMany({
            where: {
                storeId: storeId
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.error('[BILLBOARD_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
