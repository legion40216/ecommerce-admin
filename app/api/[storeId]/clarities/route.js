import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { claritySchema } from '@/lib/validators';

export async function POST(request, { params }) {
  try {
     // Authenticate user
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
        userId, // Schema shows Store ↔ User relationship
      },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Store not found" }, 
        { status: 404 }
    );
    }

    //Validate data and parse data
    const body = await request.json();
    const validatedFields = claritySchema.safeParse(body);;
    if (!validatedFields.success) {
      return NextResponse.json({ 
        error: "Validation failed",
        details: validatedFields.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    // Extract data
    const { grade } = validatedFields.data;

    // Create the clarity grade
    const clarity = await prisma.clarity.create({
      data: {
        grade,
        storeId: store.id,
      },
    });

    return NextResponse.json (
    { success: true, clarity  },
    { status: 200 }
   );
  } catch (error) {
    console.error('[clarity_POST]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
   // 1. Parameter validation
   const { storeId } = params;
   if (!storeId) {
     return NextResponse.json(
       { error: "Store ID are required" },
       { status: 400 }
     );
   }
 
    const clarities = await prisma.clarity.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

      // 3. Handle not found
      if (!clarities) {
      return NextResponse.json(
        { error: "Clarities not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      clarities,
      { status: 200 }
  );

  } catch (error) {
    console.error('[clarity_GET]', error);
    return NextResponse.json (
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}
}
