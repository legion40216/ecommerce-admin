import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { shapeSchema } from '@/lib/validators';

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
 
      const { storeId, shapeId } = params;
      if (!storeId || !shapeId) {
        return NextResponse.json(
          { error: "Store and Shape IDs are required" },
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

    // Validate body
    const body = await request.json();
    const validation = shapeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }
    
    const { name } = validation.data;

    const shape = await prisma.shape.updateMany({
      where: { 
        id: shapeId, 
        storeId: store.id 
      },
      data: { 
        name 
      },
    });

    if (shape.count === 0) {
      return NextResponse.json(
        { error: "Shape not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, shape },
      { status: 200 }
    );
  } catch (error) {
    console.error('[shape_PATCH]', error);
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
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const { storeId, shapeId } = params;
    if (!storeId || !shapeId) {
      return NextResponse.json(
        { error: "Store and Shape IDs are required" },
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

    const shape =await prisma.shape.delete({
      where: { 
        id: shapeId,
        storeId: store.id

       },
    });

    return NextResponse.json(
      { success: true, shape },
      { status: 200 }
    );
  } catch (error) {
    console.error('[shape_DELETE]', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2003') { // Foreign key constraint failed
            return NextResponse.json(
              { error: "Please delete all products linked to this shape first." },
              { status: 400 }
            );
          }
          if (error.code === 'P2025') {
            return NextResponse.json(
              { error: "Shape not found within this store." },
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
    const { storeId, shapeId } = params;
    if (!storeId || !shapeId) {
      return NextResponse.json(
        { error: "Store and Shape IDs are required" },
        { status: 400 }
      );
    }

    const shape = await prisma.shape.findFirst({
      where: { id: shapeId, storeId },
    });

    if (!shape) {
      return NextResponse.json(
        { error: "Shape not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      shape ,
      { status: 200 }
    );
  } catch (error) {
    console.error('[shape_GET]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
