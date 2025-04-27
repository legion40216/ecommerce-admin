import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const claritySchema = z.object({
  grade: z.string().min(1, { message: "Grade is required" }),
});

export async function GET(request, { params }) {
  try {
    if (!params.storeId || !params.clarityId) {
      return new NextResponse("Store and Clarity IDs are required", { status: 400 });
    }

    const { storeId, clarityId } = params;

    const clarity = await prisma.clarity.findFirst({
      where: {
        id: clarityId,
        storeId,
      },
    });

    if (!clarity) {
      return new NextResponse("Clarity not found", { status: 404 });
    }

    return NextResponse.json(clarity);
  } catch (error) {
    console.error('[clarity_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.clarityId) {
      return new NextResponse("Store and Clarity IDs are required", { status: 400 });
    }

    const body = await request.json();
    const parseResult = claritySchema.safeParse(body);

    if (!parseResult.success) {
      return new NextResponse(parseResult.error.errors[0].message, { status: 400 });
    }

    const { grade } = parseResult.data;
    const { storeId, clarityId } = params;

    // Ensure the store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Update the clarity grade
    const clarity = await prisma.clarity.updateMany({
      where: {
        id: clarityId,
        storeId,
      },
      data: { grade },
    });

    if (clarity.count === 0) {
      return new NextResponse("Clarity not found or not authorized", { status: 404 });
    }

    return NextResponse.json(clarity);
  } catch (error) {
    console.error('[clarity_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId || !params.clarityId) {
      return new NextResponse("Store and Clarity IDs are required", { status: 400 });
    }

    const { storeId, clarityId } = params;

    // Ensure the clarity belongs to the store
    const clarity = await prisma.clarity.findFirst({
      where: {
        id: clarityId,
        storeId,
      },
    });

    if (!clarity) {
      return new NextResponse("Clarity not found", { status: 404 });
    }

    // Delete the clarity
    await prisma.clarity.delete({
      where: { id: clarityId },
    });

    return NextResponse.json({ message: "Clarity deleted successfully" });
  } catch (error) {
    console.error('[clarity_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
