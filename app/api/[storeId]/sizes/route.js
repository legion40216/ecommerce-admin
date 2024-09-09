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

        const size = await prisma.size.create({
            data: {
               name,
               value,
               storeId
            }
        });


        return NextResponse.json(size);

    } catch (error) {
        console.error('[size_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const siezs = await prisma.size.findMany({
            where: {
                storeId
            }
        });

        return NextResponse.json(siezs);

    } catch (error) {
        console.error('[size_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
