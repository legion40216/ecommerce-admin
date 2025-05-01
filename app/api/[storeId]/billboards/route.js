import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { billboardSchema } from '@/lib/validators';

export async function POST(request, { params }) {
    try {
      // 1. Authentication
      const { userId } = auth();
      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized" }, 
          { status: 401 });
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
          userId // Schema shows Store ↔ User relationship
        }
      });
      if (!store) {
        return NextResponse.json(
            { error: "Store not found" }, 
            { status: 404 }
        );
      }
  
      // 4. Validate request body
      const body = await request.json();
      const validatedFields = billboardSchema.safeParse(body);
      if (!validatedFields.success) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validatedFields.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
  
      const { label, imageUrl } = validatedFields.data;
      
      const billboard = await prisma.billboard.create({
        data: {
          label,
          imageUrl,
          storeId: store.id,  // Use verified store ID
        }
      });
  
      return NextResponse.json(
        { success: true, billboard },
        { status: 201 } 
      );
  
    } catch (error) {
      console.error('[BILLBOARD_POST]', error);

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

export async function GET(request, { params }) {
  try {
    
    // 1. Parameter validation
    const { storeId } = params;
    if(!storeId) {
        return NextResponse.json(
            { error: "Store ID are required" },
            { status: 400 }
          );
    }

    const billboard = await prisma.billboard.findMany({
        where: {
            storeId: storeId
        }
    });

    // 3. Handle not found
    if (!billboard) {
      return NextResponse.json(
        { error: "Billboard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      billboard, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error('[BILLBOARD_GET]', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}