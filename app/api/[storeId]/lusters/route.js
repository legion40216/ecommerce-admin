import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const lusterSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
});

export async function POST(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await request.json();
    const parseResult = lusterSchema.safeParse(body);

    if (!parseResult.success) {
      return new NextResponse(parseResult.error.errors[0].message, { status: 400 });
    }

    const { type } = parseResult.data;

    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }

    const { storeId } = params;

    // Ensure the store exists and belongs to the user
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Create the luster
    const luster = await prisma.luster.create({
      data: {
        type,
        storeId,
      },
    });

    return NextResponse.json(luster);
  } catch (error) {
    console.error('[luster_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }

    const { storeId } = params;

    const lusters = await prisma.luster.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(lusters);
  } catch (error) {
    console.error('[luster_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
