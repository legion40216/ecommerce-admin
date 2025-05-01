import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { lusterSchema } from '@/lib/validators';

export async function POST(request, { params }) {
  try {
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
     const validatedFields = lusterSchema.safeParse(body);;
     if (!validatedFields.success) {
       return NextResponse.json({ 
         error: "Validation failed",
         details: validatedFields.error.flatten().fieldErrors 
       }, { status: 400 });
     }
    // Extract data
    const { type } = validatedFields.data;

    const luster = await prisma.luster.create({
      data: {
        type,
        storeId: store.id,
      },
    });

    return NextResponse.json (
      { success: true, luster },
      { status: 200 }
     );
  } catch (error) {
    console.error('[luster_POST]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {

    // Extract and validate storeId
    const { storeId } = params;
    if(!storeId) {
        return NextResponse.json(
            { error: "Store is required" },
            { status: 400 }
        );
    }

    const lusters = await prisma.luster.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Handle not found
    if (!lusters) {
    return NextResponse.json(
      { error: "Lusters not found" },
      { status: 404 }
    );
  }

    return NextResponse.json(
      lusters ,
      { status: 200 }
  );
  } catch (error) {
    console.error('[luster_GET]', error);
    return NextResponse.json (
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


