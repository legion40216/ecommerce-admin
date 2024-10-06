import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const shapeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export async function GET(request, { params }) {
  try {
    if (!params.storeId || !params.shapeId) {
      return new NextResponse("Store and Shape IDs are required", { status: 400 });
    }

    const { storeId, shapeId } = params;

    const shape = await prisma.shape.findFirst({
      where: {
        id: shapeId,
        storeId,
      },
    });

    if (!shape) {
      return new NextResponse("Shape not found", { status: 404 });
    }

    return NextResponse.json(shape);
  } catch (error) {
    console.error('[shape_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.shapeId) {
      return new NextResponse("Store and Shape IDs are required", { status: 400 });
    }

    const body = await request.json();
    const parseResult = shapeSchema.safeParse(body);

    if (!parseResult.success) {
      return new NextResponse(parseResult.error.errors[0].message, { status: 400 });
    }

    const { name } = parseResult.data;
    const { storeId, shapeId } = params;

    // Ensure the store exists and belongs to the user
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Update the shape
    const shape = await prisma.shape.updateMany({
      where: {
        id: shapeId,
        storeId,
      },
      data: { name },
    });

    if (shape.count === 0) {
      return new NextResponse("Shape not found or not authorized", { status: 404 });
    }

    return NextResponse.json(shape);
  } catch (error) {
    console.error('[shape_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.shapeId) {
      return new NextResponse("Store and Shape IDs are required", { status: 400 });
    }

    const { storeId, shapeId } = params;

    // Ensure the shape belongs to the store
    const shape = await prisma.shape.findFirst({
      where: {
        id: shapeId,
        storeId,
      },
    });

    if (!shape) {
      return new NextResponse("Shape not found", { status: 404 });
    }

    // Delete the shape
    await prisma.shape.delete({
      where: { id: shapeId },
    });

    return NextResponse.json({ message: "Shape deleted successfully" });
  } catch (error) {
    console.error('[shape_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
