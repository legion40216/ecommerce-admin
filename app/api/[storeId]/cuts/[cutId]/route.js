import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { cutSchema } from '@/lib/validators';

export async function PATCH(request, { params }) {
  try {
     // Authenticate user
     const { userId } = auth(); 
     if (!userId) {
         return NextResponse.json(
         { error: "Unauthorized" }, 
         { status: 401 }
         );
     }

     // 2. Extract and validate parameters
     const { storeId, cutId } = params;
     if (!storeId || !cutId) {
       return NextResponse.json(
         { error: "Store ID and Cut ID are required" },
         { status: 400 }
       );
     }

   // 3. Verify store ownership
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

    // Update the cut grade
  const cut = await prisma.cut.update({
      where: {
        id: cutId,
        storeId: store.id,
      },
      data: { grade },
    });

    return NextResponse.json(
      { success: true, cut },
      { status: 200 }
    );
  } catch (error) {
    console.error('[cut_PATCH]', error);
    // Handle not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Cut not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // 2. Parameter validation
    const { storeId, cutId } = params;
    if (!storeId || !cutId) {
      return NextResponse.json(
        { error: "Store ID and Cut ID are required" },
        { status: 400 }
      );
    }

   // 3. Verify store ownership
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

  // Delete the cut
  const cut = await prisma.cut.delete({
    where: { 
      id: cutId,
      storeId: store.id 
    },
  });

    return NextResponse.json(
      { success: true, cut }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('[cut_DELETE]', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Cut not found within this store." },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
      // 1. Parameter validation
      const { storeId, cutId } = params;
      if (!storeId || !cutId) {
        return NextResponse.json(
          { error: "Store ID and Cut ID are required" },
          { status: 400 }
        );
      }

    const cut = await prisma.cut.findFirst({
      where: {
        id: cutId,
        storeId,
      },
    });

    if (!cut) {
      return NextResponse.json (
        { error: "Cut not found" },
        { status: 404 }
    )
  }

    return NextResponse.json(
      cut ,
      { status: 200 }
  );
  } catch (error) {
    console.error('[cut_GET]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}