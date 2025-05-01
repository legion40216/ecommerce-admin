import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { lusterSchema } from '@/lib/validators';

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
      const { storeId, lusterId } = params;
      if (!storeId || !lusterId) {
        return NextResponse.json(
          { error: "Store ID and Luster ID are required" },
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
     const validatedFields = lusterSchema.safeParse(body);;
     if (!validatedFields.success) {
       return NextResponse.json({ 
         error: "Validation failed",
         details: validatedFields.error.flatten().fieldErrors 
       }, { status: 400 });
     }
 
    // Extract data
    const { type } = validatedFields.data;
 
    const luster = await prisma.luster.update({
      where: {
        id: lusterId,
        storeId: store.id,
      },
      data: { type },
    });

    return NextResponse.json(
      { success: true, luster },
      { status: 200 }
    );
  } catch (error) {
    console.error('[luster_PATCH]', error);
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
    const { storeId, lusterId } = params;
    if (!storeId || !lusterId) {
      return NextResponse.json(
        { error: "Store ID and Luster ID are required" },
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

    // Delete the luster
    const luster = await prisma.luster.delete({
      where: { 
        id: lusterId,
        storeId: store.id 
       },
    });

    return NextResponse.json(
      { success: true, luster },
      { status: 200 }
    );

  } catch (error) {
    console.error('[luster_DELETE]', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Luster not found within this store." },
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
    // Extract and validate lusterId 
    const { lusterId } = params;
      if(!lusterId) {
        return NextResponse.json(
            { error: "Luster is required" },
            { status: 400 }
        );
    }

    // Extract and validate storeId 
    const { storeId } = params;
    if(!storeId) {
        return NextResponse.json(
            { error: "Store is required" },
            { status: 400 }
        );
    }

    const luster = await prisma.luster.findFirst({
      where: {
        id: lusterId,
        storeId,
      },
    });

    if (!luster) {
      return NextResponse.json (
      { error: "luster not found" },
      { status: 404 }
      )
    }

    return NextResponse.json(
      luster ,
      { status: 200 }
  );

  } catch (error) {
    console.error('[luster_GET]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}



