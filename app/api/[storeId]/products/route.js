import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request,{params}) {
    try {
        const { userId } = auth(); 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }
  
        const body = await request.json();
        const { name, price, isFeatured, isArchived, categoryId, colorId, sizeId, images } = body;

        if (!name || !price || !categoryId || !colorId || !sizeId || !images)      
        {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const product = await prisma.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId,
                images: {
                    createMany: {
                        data: images.map((image) => ({
                            url: image.url // Extract the URL from each image
                        }))
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error('[product_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        
        if(!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { storeId } = params;

        const products = await prisma.product.findMany({
            where: {
                storeId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
        });

        return NextResponse.json(products);

    } catch (error) {
        console.error('[product_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
