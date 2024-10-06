import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const lusterSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
});

export async function GET(request, { params }) {
  try {
    if (!params.storeId || !params.lusterId) {
      return new NextResponse("Store and Luster IDs are required", { status: 400 });
    }

    const { storeId, lusterId } = params;

    const luster = await prisma.luster.findFirst({
      where: {
        id: lusterId,
        storeId,
      },
    });

    if (!luster) {
      return new NextResponse("Luster not found", { status: 404 });
    }

    return NextResponse.json(luster);
  } catch (error) {
    console.error('[luster_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.lusterId) {
      return new NextResponse("Store and Luster IDs are required", { status: 400 });
    }

    const body = await request.json();
    const parseResult = lusterSchema.safeParse(body);

    if (!parseResult.success) {
      return new NextResponse(parseResult.error.errors[0].message, { status: 400 });
    }

    const { type } = parseResult.data;
    const { storeId, lusterId } = params;

    // Ensure the store exists and belongs to the user
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Update the luster
    const updatedLuster = await prisma.luster.updateMany({
      where: {
        id: lusterId,
        storeId,
      },
      data: { type },
    });

    if (updatedLuster.count === 0) {
      return new NextResponse("Luster not found or not authorized", { status: 404 });
    }

    return NextResponse.json(updatedLuster);
  } catch (error) {
    console.error('[luster_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.lusterId) {
      return new NextResponse("Store and Luster IDs are required", { status: 400 });
    }

    const { storeId, lusterId } = params;

    // Ensure the luster belongs to the store
    const luster = await prisma.luster.findFirst({
      where: {
        id: lusterId,
        storeId,
      },
    });

    if (!luster) {
      return new NextResponse("Luster not found", { status: 404 });
    }

    // Delete the luster
    await prisma.luster.delete({
      where: { id: lusterId },
    });

    return NextResponse.json({ message: "Luster deleted successfully" });
  } catch (error) {
    console.error('[luster_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
