import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request,{params}) {
    try {
        const { userId } = auth(); 

        if (!userId) {
            return new NextResponse(
                "Unauthenticated", 
                { status: 401 }
            );
        }

              // 2. Validate parameters
       const { storeId } = params;
       if (!storeId) {
         return NextResponse.json(
           { error: "Store ID is required" },
           { status: 400 }
         );
       }
   
       // 3. Verify store ownership (critical!)
       const store = await prisma.store.findUnique({
         where: {
           id: storeId,
           userId, // Schema shows Store ↔ User relationship
         },
       });
       if (!store) {
         return NextResponse.json(
           { error: "Store not found" }, 
           { status: 404 }
       );
       }
  
        const body = await request.json();
        const { name, value } = body;

        if (!name || !value) {
          return new NextResponse(
            "Missing required fields", 
            { status: 400 }
        );
        }

        const size = await prisma.size.create({
            data: {
               name,
               value,
               storeId: store.id
            }
        });


        return NextResponse.json (
            { success: true, size },
            { status: 200 }
           );

    } catch (error) {
        console.error('[size_POST]', error);
        return new NextResponse(
            "Internal error", 
            { status: 500 }
        );
    }
}

export async function GET(request,{params}) {
    try {
        
        const { sizeId, storeId } = params;
        if (!storeId) {
          return NextResponse.json(
              { error: "Store is required" }, 
              { status: 400 }
          );
        }
        if (!sizeId) {
          return NextResponse.json(
              { error: "Size ID is required" }, 
              { status: 400 }
          );
        }

        const sizes = await prisma.size.findMany({
            where: {
                storeId
            }
        });

        if (!sizes) {
            return NextResponse.json(
                { error: "Size not found" },
                { status: 404 }
            );
          }

    } catch (error) {
        console.error('[size_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
