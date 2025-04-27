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
        const { name, value } = body;

        if (!name || !value) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const color = await prisma.color.create({
            data: {
               name:        body.name,
               value:       body.value,
               storeId :    storeId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.error('[color_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const colors = await prisma.color.findMany({
            where: {
                storeId: storeId
            }
        });

        return NextResponse.json(colors);

    } catch (error) {
        console.error('[color_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
