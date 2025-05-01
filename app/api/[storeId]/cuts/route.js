import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { cutSchema } from '@/lib/validators';

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
     const validatedFields = cutSchema.safeParse(body);;
     if (!validatedFields.success) {
       return NextResponse.json({ 
         error: "Validation failed",
         details: validatedFields.error.flatten().fieldErrors 
       }, { status: 400 });
     }
 
     // Extract data
     const { grade } = validatedFields.data;

    const cut = await prisma.cut.create({
      data: {
        grade,
        storeId,
      },
    });

    return NextResponse.json(
      { success: true, cut },
      { status: 200 }
    );

  } catch (error) {
    console.error('[cut_POST]', error);
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
    if (!storeId) {
      return NextResponse.json(
        { error: "Store is required" }, 
        { status: 400 }
      );
    }

    const cuts = await prisma.cut.findMany({
      where: {
        storeId: storeId
    }
    });

    // 3. Handle not found
      if (!cuts) {
        return NextResponse.json(
          { error: "Cut not found" },
          { status: 404 }
        );
      }

    return NextResponse.json(
      cuts , 
      { status: 200 }
    );
  } catch (error) {
    console.error("[cut_GET]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
