import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { productSchema } from '@/lib/validators';

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
      const { storeId, productId } = params;
      if (!storeId || !productId) {
        return NextResponse.json(
          { error: "Missing parameters" },
          { status: 400 }
        );
      }

      // 4. Verify store ownership
      const store = await prisma.store.findUnique({
        where: {
          id: storeId,
          userId, // Ensure store belongs to authenticated user
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
      const validatedFields = productSchema.safeParse(body);
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
      const {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        images,
        location,
        quantity,
        weight,
        shapeId,
        clarityId,
        cutId,
        length,
        width,
        depth,
        lusterId,
        treatment,
        certification,
        origin,
        rarityFactor,
        inclusions,
        fluorescence,
        zodiacId,
      } = validatedFields.data;

      // Perform a transaction to update the product and handle images
      const product = await prisma.$transaction(async (prisma) => {
        const updatedProduct = await prisma.product.update({
          where: { 
            id: productId,
            storeId: store.id  
          },
          data: {
            name,
            price,
            isFeatured,
            isArchived,
            categoryId,
            colorId,
            sizeId,
            location,
            quantity,
            weight,
            shapeId,
            clarityId,
            cutId,
            length,
            width,
            depth,
            lusterId,
            treatment,
            certification,
            origin,
            rarityFactor,
            inclusions,
            fluorescence,
            zodiacId,
          },
        });

        // Delete existing images associated with the product
        await prisma.image.deleteMany({
          where: { productId: params.productId },
        });

        // Create new images
        await prisma.image.createMany({
          data: images.map((image) => ({
            url: image.url,
            productId: params.productId,
          })),
        });

        return updatedProduct;
      });

      return NextResponse.json(
        { success: true, product }, 
        { status: 200 }
      );
    } catch (error) {
    console.error('[PRODUCT_PATCH]', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return NextResponse.json(
            { error: "Product not found" },
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

        // Extract and validate productId 
        const { productId } = params;
        if(!productId) {
            return NextResponse.json(
                { error: "Product is required" },
                { status: 400 }
            );
        }

        // Extract and validate storeId
        const { storeId } = params;
        if (!storeId) {
            return NextResponse.json(
            { error: "Store is required" }, 
            { status: 400 }
            );
        }

      // 4. Verify store ownership
      const store = await prisma.store.findUnique({
        where: {
          id: storeId,
          userId, // Ensure store belongs to authenticated user
        },
      });
      if (!store) {
        return NextResponse.json(
          { error: "Store not found" }, 
          { status: 404 }
        );
      }

        // Then delete the product
        const product = await prisma.product.delete({
            where: { 
              id: productId,
              storeId: store.id  
            },
        });

        return NextResponse.json(
            { success: true, product }, 
            { status: 200 }
          );
    } catch (error) {
        console.error('[PRODUCT_DELETE]', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2025') {
                return NextResponse.json(
                  { error: "Product not found within this store." },
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

        // Extract and validate params
        const { productId } = params;
        if (!productId) {
        return NextResponse.json(
            { error: "Product ID is required" },
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

        const product = await prisma.product.findFirst({
            where: { 
              id: productId,
              storeId: storeId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
                shape: true,
                clarity: true,
                cut: true,
                luster: true,
                zodiac: true,
            },
        });

        // Check if product exists
        if (!product) {
            return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
            );
        }

        // Return the product
        return NextResponse.json(
            product, 
            { status: 200 }
        );

    } catch (error) {
        console.error('[PRODUCT_GET]', error);
        return NextResponse.json(
            { error: "An unexpected error occurred" },
            { status: 500 }
          );
    }
}