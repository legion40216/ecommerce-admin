import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const claritySchema = z.object({
  grade: z.string().min(1, { message: "Grade is required" }),
});

export async function POST(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await request.json();
    const parseResult = claritySchema.safeParse(body);

    if (!parseResult.success) {
      return new NextResponse(parseResult.error.errors[0].message, { status: 400 });
    }

    const { grade } = parseResult.data;

    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }

    const { storeId } = params;

    // Ensure the store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Create the clarity grade
    const clarity = await prisma.clarity.create({
      data: {
        grade,
        storeId,
      },
    });

    return NextResponse.json(clarity);
  } catch (error) {
    console.error('[clarity_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store is required", { status: 400 });
    }

    const { storeId } = params;

    const clarities = await prisma.clarity.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clarities);
  } catch (error) {
    console.error('[clarity_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
