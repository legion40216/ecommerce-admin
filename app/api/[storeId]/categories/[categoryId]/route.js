import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { categorySchema } from '@/lib/validators';

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
      const { storeId, categoryId } = params;
      if (!storeId || !categoryId) {
        return NextResponse.json(
          { error: "Store ID and Category ID are required" },
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
      const validatedFields = categorySchema.safeParse(body);
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
      const { name, billboardId } = validatedFields.data;

      const category = await prisma.category.update({
        where: {
          id: categoryId,
          storeId: store.id, // Use verified store ID 
        },
        data: {
          name,
          billboardId,
        },
      });

      return NextResponse.json(
        { success: true, category }, 
        { status: 200 }
    );
    } catch (error) {
        console.error('[categories_PATCH]', error);

        // Handle not found error
        if (error instanceof Prisma.PrismaClientKnownRequestError) {

          if (error.code === 'P2025') {
            return NextResponse.json(
              { error: "Category not found" },
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
    // 1. Authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // 2. Parameter validation
    const { storeId, categoryId } = params;
    if (!storeId || !categoryId) {
      return NextResponse.json(
        { error: "Store ID and CategoryId ID are required" },
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

    const category = await prisma.category.delete({
      where: {
        id: categoryId,
        storeId: store.id , // Use verified store ID
      },
    });

    return NextResponse.json(
        { success: true, category }, 
        { status: 200 }
    );
  } catch (error) {
    console.error("[category_DELETE]", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          return NextResponse.json(
            { error: "Delete linked products first" },
            { status: 400 }
          );
        }
        if (error.code === "P2025") {
          return NextResponse.json(
            { error: "Category not found within this store." },
            { status: 404 }
          );
        }
      }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    // 1. Parameter validation
    const { storeId, categoryId } = params;
    if (!storeId || !categoryId) {
      return NextResponse.json(
        { error: "Store ID and Category ID are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
        storeId,
      },
      include: {
        billboard: true,
      },
    });

    // 3. Handle not found
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
        category, 
        { status: 200 }
    );
  } catch (error) {
    console.error("[category_GET]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}





