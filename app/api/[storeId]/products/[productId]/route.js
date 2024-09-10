import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(request,{params}) {
    try {

        const { userId } = auth(); 
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const body = await request.json();
        const {  
            name,
            price,
            isFeatured,
            isArchived,
            categoryId, 
            colorId,
            sizeId,
            images 
            } = body;

        if ( !name || !price || !categoryId || !colorId || !sizeId || !images ) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.productId) {
            return new NextResponse("product is required", { status: 400 });
        }

        const { productId } = params;

        await prisma.product.update({
            where: {
              id: productId,
            },
            data: {
              name,
              price,
              isFeatured,
              isArchived,
              categoryId, 
              colorId,
              sizeId,
              images: {
                deleteMany: {}, // Assuming this is needed to clear old images
              },
            },
          });

        const product = await prisma.product.update({
            where: {
                id: productId,
            },

            data:{
                images: {
                    createMany: {
                        data: images.map((image) => ({
                            url: image.url // Extract the URL from each image
                        }))
                    }
                }
            }

        })

        return NextResponse.json(product);
    } catch (error) {
        console.error('[product_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { userId } = auth(); // Correctly call the auth function

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.productId) {
            return new NextResponse("product is required", { status: 400 });
        }

        const { productId } = params;

        const product = await prisma.product.delete({
            where: {
                id: productId,
            },
        });

        return NextResponse.json(product);

    } catch (error) {
        console.error('[product_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        if(!params.productId) {
            return new NextResponse("product is required", { status: 400 });
        }

        const { productId } = params;

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
         console.error('[product_GET]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

