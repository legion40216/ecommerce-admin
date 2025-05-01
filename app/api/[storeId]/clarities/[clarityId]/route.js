import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { claritySchema } from '@/lib/validators';

export async function PATCH(request, { params }) {
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
      const { storeId, clarityId } = params;
      if (!storeId || !clarityId) {
        return NextResponse.json(
          { error: "Store ID and Clarity ID are required" },
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
    const validatedFields = claritySchema.safeParse(body);
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
    const { grade } = validatedFields.data;

    // Update the clarity grade
    const clarity = await prisma.clarity.update({
      where: {
        id: clarityId,
        storeId: store.id,
      },
      data: { grade },
    });

    return NextResponse.json(
      { success: true, clarity },
      { status: 200 }
    );

  } catch (error) {
    console.error('[clarity_PATCH]', error);
    // Handle not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Clarity not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const { userId } = auth(); 
    if (!userId) {
        return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
        );
    }

    // 2. Parameter validation
    const { storeId, clarityId } = params;
    if (!storeId || !clarityId) {
      return NextResponse.json(
        { error: "Store ID and ClarityId ID are required" },
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

    // Delete the clarity
    const clarity =await prisma.clarity.delete({
      where: { 
        id: clarityId, 
        storeId: store.id,
      },
    });

    return NextResponse.json(
      { success: true, clarity },
      { status: 200 }
    );

  } catch (error) {
    console.error('[clarity_DELETE]', error);
if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { error: "Clarity not found within this store." },
            { status: 404 }
          );
        }
      }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


export async function GET(request, { params }) {
  try {
    // 1. Parameter validation
    const { storeId, clarityId } = params;
    if (!storeId || !clarityId) {
      return NextResponse.json(
        { error: "Store ID and Clarity ID are required" },
        { status: 400 }
      );
    }

    // Ensure the clarity belongs to the store
    const clarity = await prisma.clarity.findFirst({
      where: {
        id: clarityId,
        storeId,
      },
    });
    
 // 3. Handle not found
    if (!clarity) {
        return NextResponse.json (
          { error: "Clarity not found" },
          { status: 404 }
      )
    }

    return NextResponse.json(
      clarity ,
      { status: 200 }
  );

  } catch (error) {
    console.error('[clarity_GET]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


