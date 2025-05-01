import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
import { productSchema } from '@/lib/validators';

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
        // 2. Extract and validate parameters
        const { storeId } = params;
        if (!storeId) {
        return NextResponse.json(
            { error: "Missing Store ID" },
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
          zodiacId, // Added zodiac
        } = validatedFields.data;

   
        const product = await prisma.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
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
                zodiacId, // Use zodiacId instead of zodiac
                images: {
                    createMany: {
                        data: images.map((image) => ({ url: image.url }))
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
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

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const sizeId = searchParams.get('sizeId');
    const colorId = searchParams.get('colorId');
    const isFeatured = searchParams.get('isFeatured');
    const isArchived = searchParams.get('isArchived');
    const shapeId = searchParams.get('shapeId');
    const clarityId = searchParams.get('clarityId');
    const cutId = searchParams.get('cutId');
    const lusterId = searchParams.get('lusterId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const zodiacId = searchParams.get('zodiacId');

    let query = { storeId: params.storeId };

    if (categoryId) query.categoryId = categoryId;
    if (sizeId) query.sizeId = sizeId;
    if (colorId) query.colorId = colorId;
    if (isFeatured !== null) query.isFeatured = isFeatured === 'true';
    if (isArchived !== null) query.isArchived = isArchived === 'true';
    if (shapeId) query.shapeId = shapeId;
    if (clarityId) query.clarityId = clarityId;
    if (cutId) query.cutId = cutId;
    if (lusterId) query.lusterId = lusterId;
    if (zodiacId) query.zodiacId = zodiacId; // Apply zodiacId filter

    // Add price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.gte = parseFloat(minPrice);
        if (maxPrice) query.price.lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
        where: query,
        include: {
            images: true,
            category: true,
            size: true,
            color: true,
            shape: true,
            clarity: true,
            cut: true,
            luster: true,
            zodiac: true, // Include zodiac details
        },
    });

      // 3. Handle not found
      if (!products) {
        return NextResponse.json(
          { error: "Products not found" },
          { status: 404 }
        );
      }

    // Set CORS headers (if necessary)
    const response = NextResponse.json(products, { status: 200 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
    } catch (error) {
        console.error('[PRODUCTS_GET]', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
