import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

export async function PATCH(request,{params}) {
    try {

       // Authenticate user
       const { userId } = auth(); 
       if (!userId) {
           return NextResponse.json(
           { error: "Unauthorized" }, 
           { status: 401 }
           );
       }

            // 2. Extract and validate parameters
             const { storeId, sizeId } = params;
             if (!storeId || !sizeId) {
               return NextResponse.json(
                 { error: "Store ID and Size ID are required" },
                 { status: 400 }
               );
             }
        
           // 3. Verify store ownership
           const store = await prisma.store.findUnique({
             where: {
               id: storeId,
               userId,
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
            return NextResponse.json({ 
            error: "Validation failed",
            details: "name and value are required"
            }, { status: 400 });
        }

        const size = await prisma.size.updateMany({
            where: {
                id: sizeId,
                storeId: store.id
            },
            
            data: {
                name,
                value
            }
        });

        if (size.count === 0) {
            return NextResponse.json(
            { error: "Size not found or not authorized" },
            { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, size },
            { status: 200 }
          );
    } catch (error) {
        console.error('[size_PATCH]', error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
          );
    }
}

export async function DELETE(request, { params }) {
    try {
      const { userId } = auth();
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

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

      // 3. Verify store ownership
      const store = await prisma.store.findUnique({
        where: {
          id: storeId,
          userId,
        },
      });
      if (!store) {
        return NextResponse.json(
          { error: "Store not found" }, 
          { status: 404 }
        );
      }

      const size = await prisma.size.delete({
        where: { id: sizeId },
      });

      return NextResponse.json(
        { success: true, size }, 
        { status: 200 }
      );
    } catch (error) {
      console.error('[size_DELETE]', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') { // Foreign key constraint failed
          return NextResponse.json(
            { error: "Please delete all products linked to this size first." },
            { status: 400 }
          );
        }
        if (error.code === 'P2025') {
          return NextResponse.json(
            { error: "Size not found within this store." },
            { status: 404 }
          );
        }
      }
      return NextResponse.json({ 
        error: "An unexpected error occurred" }, 
        { status: 500 });
    }
  }

  export async function GET(request, { params }) {
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
  
      const size = await prisma.size.findFirst({
        where: { 
          id: sizeId, 
          storeId 
        },
      });
  
      if (!size) {
        return NextResponse.json(
            { error: "Size not found" },
            { status: 404 }
        );
      }
  
      return NextResponse.json(
        { success: true, size }, 
        { status: 200 }
    );
    } catch (error) {
      console.error('[size_GET]', error);
      return NextResponse.json({ 
        error: "An unexpected error occurred" }, 
        { status: 500 }
    );
    }
  }

