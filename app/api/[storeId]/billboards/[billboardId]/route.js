import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { billboardSchema } from '@/lib/validators';

export async function PATCH(request, { params }) {
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
      const { storeId, billboardId } = params;
      if (!storeId || !billboardId) {
        return NextResponse.json(
          { error: "Store ID and Billboard ID are required" },
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
      const validatedFields = billboardSchema.safeParse(body);
      if (!validatedFields.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validatedFields.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
  
      // Extract data
      const { label, imageUrl } = validatedFields.data;

      const billboard = await prisma.billboard.update({
        where: {
          id: billboardId,
          storeId: store.id // Ensures billboard belongs to store
        },
        data: { label, imageUrl }
      });
  
      return NextResponse.json(
        { success: true, billboard },
        { status: 200 }
      );
      
    } catch (error) {
      console.error('[BILLBOARD_PATCH]', error);
  
      // Handle not found error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return NextResponse.json(
            { error: "Billboard not found" },
            { status: 404 }
          );
        }
      }
  
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

export async function DELETE(request, { params }) {
  try {
    // 1. Authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // 2. Parameter validation
    const { storeId, billboardId } = params;
    if (!storeId || !billboardId) {
      return NextResponse.json(
        { error: "Store ID and Billboard ID are required" },
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

    const billboard = await prisma.billboard.delete({
      where: {
        id: billboardId,
        storeId: store.id,  // Use verified store ID
      },
    });

    return NextResponse.json(
      { success: true, billboard },
      { status: 200 }
    );

  } catch (error) {
    console.error('[BILLBOARD_DELETE]', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: "Delete linked categories first" },
          { status: 400 }
        );
      }
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Billboard not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    // 1. Parameter validation
    const { storeId, billboardId } = params;
    if (!storeId || !billboardId) {
      return NextResponse.json(
        { error: "Store ID and Billboard ID are required" },
        { status: 400 }
      );
    }


    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
        storeId 
      },
    });

    // 3. Handle not found
    if (!billboard) {
      return NextResponse.json(
        { error: "Billboard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      billboard, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('[BILLBOARD_GET]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}