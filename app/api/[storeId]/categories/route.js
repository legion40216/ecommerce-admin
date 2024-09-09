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
        const { name, billboardId } = body;

        if (!name || !billboardId) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const categories = await prisma.category.create({
            data: {
               name,
               billboardId,
               storeId
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.error('[categories_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const categories = await prisma.category.findMany({
            where: {
                storeId: storeId
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.error('[categories_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
