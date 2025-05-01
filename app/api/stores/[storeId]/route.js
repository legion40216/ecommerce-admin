import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { storeSchema } from '@/lib/validators';

export async function PATCH(request,{params}) {
    try {

      // 1. Authenticate user
      const { userId } = auth();
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 }
        );
      }
          // 2. Extract and validate parameters
          const { storeId } = params;
          if (!storeId ) {
            return NextResponse.json(
              { error: "Store ID  are required" },
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

       // 4. Validate request body
        const body = await request.json();
        const validatedFields = storeSchema.safeParse(body);
        if (!validatedFields.success) {
        return NextResponse.json(
            {
            error: "Validation failed",
            details: validatedFields.error.flatten().fieldErrors,
            },
            { status: 400 }
        );
        }

        const { name } = validatedFields.data;

        const storeUpdated = await prisma.store.update({
            where: {
                id: storeId,
            },
            
            data: {
               name
            }
        });

        return NextResponse.json(
          { success: true, storeUpdated },
          { status: 200 }
        );
    } catch (error) {
        console.log(error);
      // Handle not found error
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            return NextResponse.json(
              { error: "User not found" },
              { status: 404 }
            );
          }
        }
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
    // 1. Authenticate user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }
        // 2. Extract and validate parameters
        const { storeId } = params;
        if (!storeId ) {
          return NextResponse.json(
            { error: "Store ID  are required" },
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

        const storeDelete = await prisma.store.delete({
            where: {
                id: storeId,
            },
        });
        
        return NextResponse.json(
          { success: true, storeDelete },
          { status: 200 }
        );
    } catch (error) {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            return NextResponse.json(
              { error: "User not found" },
              { status: 404 }
            );
          }
        }
        return new NextResponse("Internal Error", { status: 500 });
    }
}