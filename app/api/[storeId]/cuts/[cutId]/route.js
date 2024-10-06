import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const cutSchema = z.object({
  grade: z.string().min(1, { message: "Grade is required" }),
});

export async function GET(request, { params }) {
  try {
    if (!params.storeId || !params.cutId) {
      return new NextResponse("Store and Cut IDs are required", { status: 400 });
    }

    const { storeId, cutId } = params;

    const cut = await prisma.cut.findFirst({
      where: {
        id: cutId,
        storeId,
      },
    });

    if (!cut) {
      return new NextResponse("Cut not found", { status: 404 });
    }

    return NextResponse.json(cut);
  } catch (error) {
    console.error('[cut_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.cutId) {
      return new NextResponse("Store and Cut IDs are required", { status: 400 });
    }

    const body = await request.json();
    const parseResult = cutSchema.safeParse(body);

    if (!parseResult.success) {
      return new NextResponse(parseResult.error.errors[0].message, { status: 400 });
    }

    const { grade } = parseResult.data;
    const { storeId, cutId } = params;

    // Ensure the store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Update the cut grade
    const cut = await prisma.cut.updateMany({
      where: {
        id: cutId,
        storeId,
      },
      data: { grade },
    });

    if (cut.count === 0) {
      return new NextResponse("Cut not found or not authorized", { status: 404 });
    }

    return NextResponse.json(cut);
  } catch (error) {
    console.error('[cut_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.cutId) {
      return new NextResponse("Store and Cut IDs are required", { status: 400 });
    }

    const { storeId, cutId } = params;

    // Ensure the cut belongs to the store
    const cut = await prisma.cut.findFirst({
      where: {
        id: cutId,
        storeId,
      },
    });

    if (!cut) {
      return new NextResponse("Cut not found", { status: 404 });
    }

    // Delete the cut
    await prisma.cut.delete({
      where: { id: cutId },
    });

    return NextResponse.json({ message: "Cut deleted successfully" });
  } catch (error) {
    console.error('[cut_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
