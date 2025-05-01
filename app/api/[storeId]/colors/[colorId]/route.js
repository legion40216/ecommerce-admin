import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { colorSchema } from '@/lib/validators';

export async function PATCH(request,{params}) {
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
      const { storeId, colorId } = params;
      if (!storeId || !colorId) {
        return NextResponse.json(
          { error: "Store ID and Color ID are required" },
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


    // 4. Validate request body
    const body = await request.json();
    const validatedFields = colorSchema.safeParse(body);
    if (!validatedFields.success) {
        return NextResponse.json(
        {
            error: "Validation failed",
            details: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
        );
    }
    
    
    // Extract data
    const { name, value } = validatedFields.data;

    const color = await prisma.color.updateMany({
            where: {
                id: colorId,
            },
            data: {
                name,
                value
            }
        });

        
    if (color.count === 0) {
        return NextResponse.json(
            { error: "Color not found or not authorized" },
            { status: 404 }
        )
    }
        
        return NextResponse.json(
            { success: true, color },
            { status: 200 }
          );
    } catch (error) {
        console.error('[color_PATCH]', error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
          );
    }
}

export async function DELETE(request,{params}) {
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
      const { storeId, colorId } = params;
      if (!storeId || !colorId) {
        return NextResponse.json(
          { error: "Store ID and Color ID are required" },
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

      const color = await prisma.color.delete({
        where: {
          id: colorId,
          storeId: store.id,
        },
      });

      return NextResponse.json(
        { success: true, color }, 
        { status: 200 }
      );
    } catch (error) {
      console.error("[color_DELETE]", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          // Foreign key constraint failed
          return NextResponse.json(
            { error: "Please delete all products linked to this color first." },
            { status: 400 }
          );
        }
        if (error.code === "P2025") {
          return NextResponse.json(
            { error: "Color not found within this store." },
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
    const { storeId, colorId } = params;
    if (!storeId || !colorId) {
      return NextResponse.json(
        { error: "Store ID and Color ID are required" },
        { status: 400 }
      );
    }

    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    // 3. Handle not found
    if (!color) {
      return NextResponse.json(
        { error: "Color not found" }, 
        { status: 404 }
    );
    }

    return NextResponse.json(
         color , 
        { status: 200 }
    );
  } catch (error) {
    console.error("[color_GET]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

