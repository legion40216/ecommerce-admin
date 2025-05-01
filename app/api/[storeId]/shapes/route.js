import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { shapeSchema } from '@/lib/validators';

export async function POST(request, { params }) {
  try {
    // Authenticate
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
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

    // Create shape
    const shape = await prisma.shape.create({
      data: { 
        name,
        storeId: store.id
      }
    });

    return NextResponse.json(
      { success: true, shape },
      { status: 200 }
    );
  } catch (error) {
    console.error('[shape_POST]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    // Validate storeId
    const { storeId } = params;
    if (!storeId) {
      return NextResponse.json(
        { error: "Store is required" },
        { status: 400 }
      );
    }

    // Fetch
    const shapes = await prisma.shape.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      shapes,
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
